import { DataTypes, Model, Sequelize } from "sequelize";
import { Teacher } from "./teacher.model";
import { LessonTeachers } from "./lessonTeachers.model";
import { Student } from "./student.model";
import { LessonStudents } from "./lessonStudents.model";

export class Lesson extends Model {
  public id!: number;
  public date!: string;
  public title!: string;
  public status!: number;

  public students?: (Student & {
    id: number;
    name: string;
    LessonStudents: { visit: boolean };
  })[];
  public teachers?: { id: number; name: string }[];

  static initModel(sequelize: Sequelize) {
    Lesson.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isIn: [[0, 1]], 
          },
        },
      },
      {
        sequelize,
        tableName: "lessons",
        timestamps: false,
        indexes: [
          {
            fields: ["date"], 
          },
          {
            fields: ["status"], 
          },
        ],
      }
    );
  }

  static associateModels() {
    Lesson.belongsToMany(Teacher, {
      through: LessonTeachers,
      foreignKey: "lesson_id",
      as: "teachers",
    });
    Lesson.belongsToMany(Student, {
      through: LessonStudents,
      foreignKey: "lesson_id",
      as: "students",
    });
  }
}
