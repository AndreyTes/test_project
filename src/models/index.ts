import { Sequelize } from "sequelize";
import { Lesson } from "./lesson.model";
import { Teacher } from "./teacher.model";
import { Student } from "./student.model";
import { LessonTeachers } from "./lessonTeachers.model";
import { LessonStudents } from "./lessonStudents.model";

const sequelize = new Sequelize("postgres_db", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
});

Lesson.initModel(sequelize);
Teacher.initModel(sequelize);
Student.initModel(sequelize);
LessonTeachers.initModel(sequelize);
LessonStudents.initModel(sequelize);

Lesson.associateModels();
Teacher.associateModels();
Student.associateModels();

export { sequelize };
