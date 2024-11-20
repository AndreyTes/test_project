import { Router, Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import { Lesson } from "../models/lesson.model";
import { Teacher } from "../models/teacher.model";
import { Student } from "../models/student.model";
import { sequelize } from "../models/index";

const router = Router();

router.get("/all", async (req, res) => {
  const lessons = await Lesson.findAll();
  res.json(lessons);
});

router.get("/sync", async (req, res) => {
  await sequelize.sync({ alter: true });
  res.json("DB sync");
});

router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const {
        date,
        status,
        teacherIds,
        studentsCount,
        page = 1,
        lessonsPerPage = 15,
      } = req.query;

      // Проверка параметров
      if (status && ![0, 1].includes(Number(status))) {
        return res
          .status(400)
          .json({ error: "Invalid status. Must be 0 or 1." });
      }

      if (page && Number(page) < 1) {
        return res
          .status(400)
          .json({ error: "Page number must be 1 or greater." });
      }

      if (lessonsPerPage && Number(lessonsPerPage) < 1) {
        return res
          .status(400)
          .json({ error: "Lessons per page must be 1 or greater." });
      }

      // Условия для фильтрации
      const where: any = {};

      // Фильтр по дате
      if (date) {
        const dates = (date as string).split(",");
        if (dates.length === 1) {
          where.date = dates[0];
        } else if (dates.length === 2) {
          where.date = {
            [Op.between]: [new Date(dates[0]), new Date(dates[1])],
          };
        } else {
          return res.status(400).json({
            error:
              "Invalid date format. Use YYYY-MM-DD or YYYY-MM-DD,YYYY-MM-DD.",
          });
        }
      }

      // Фильтр по статусу
      if (status) {
        where.status = Number(status);
      }

      // Фильтр по учителям
      let teacherFilter;
      if (teacherIds) {
        const teacherIdArray = (teacherIds as string)
          .split(",")
          .map((id) => Number(id.trim()))
          .filter((id) => !isNaN(id));
        if (teacherIdArray.length === 0) {
          return res.status(400).json({ error: "Invalid teacherIds format." });
        }
        teacherFilter = { id: { [Op.in]: teacherIdArray } };
      }

      // Фильтр по количеству студентов
      let studentCountFilter: any = null;
      if (studentsCount) {
        const counts = (studentsCount as string).split(",");
        if (counts.length === 1) {
          studentCountFilter = counts;
        } else if (counts.length === 2) {
          const [minCount, maxCount] = counts.map((count) =>
            parseInt(count, 10)
          );
          if (isNaN(minCount) || isNaN(maxCount)) {
            return res
              .status(400)
              .json({ error: "Invalid studentsCount range format." });
          }
          studentCountFilter = [minCount, maxCount];
        } else {
          return res
            .status(400)
            .json({ error: "Invalid studentsCount format." });
        }
      }

      // Пагинация
      const limit = Number(lessonsPerPage);
      const offset = (Number(page) - 1) * limit;

      // Запрос к базе данных
      const lessons = await Lesson.findAndCountAll({
        where,
        include: [
          {
            model: Teacher,
            as: "teachers",
            where: teacherFilter,
            required: !!teacherFilter,
            attributes: ["id", "name"],
          },
          {
            model: Student,
            as: "students",
            attributes: ["id", "name"],
            through: { attributes: ["visit"] },
          },
        ],
        limit,
        offset,
      });

      // Пост-обработка для подсчета количества студентов
      const lessonsData = lessons.rows
        .filter((lesson) => {
          const totalStudents = lesson.students?.length;

          if (
            studentCountFilter &&
            studentCountFilter.length === 1 &&
            !(totalStudents == studentCountFilter[0])
          ) {
            return false;
          }

          if (
            !totalStudents ||
            (studentCountFilter &&
              studentCountFilter.length === 2 &&
              totalStudents &&
              !(
                totalStudents >= studentCountFilter[0] &&
                totalStudents <= studentCountFilter[1]
              ))
          ) {
            return false;
          }
          return true;
        })
        .map((lesson) => {
          const visitCount = lesson.students?.filter(
            (student) => student.LessonStudents.visit
          ).length;

          return {
            id: lesson.id,
            date: lesson.date,
            title: lesson.title,
            status: lesson.status,
            visitCount,
            students: lesson.students?.map((student) => ({
              id: student.id,
              name: student.name,
              visit: student.LessonStudents.visit,
            })),
            teachers: lesson.teachers?.map((teacher) => ({
              id: teacher.id,
              name: teacher.name,
            })),
          };
        });

      res.status(200).json({
        data: lessonsData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
);

export default router;
