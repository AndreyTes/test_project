import { DataTypes, Model, Sequelize } from "sequelize";
import { LessonStudents } from "./lessonStudents.model";
import { Lesson } from "./lesson.model";

export class Student extends Model {
  static initModel(sequelize: Sequelize) {
    Student.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "students",
        timestamps: false,
        indexes: [{ fields: ["name"] }],
      }
    );
  }

  static associateModels() {
    Student.belongsToMany(Lesson, {
      through: LessonStudents,
      foreignKey: "student_id",
    });
  }
}
