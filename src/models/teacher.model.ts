import { DataTypes, Model, Sequelize } from "sequelize";
import { Lesson } from "./lesson.model";
import { LessonTeachers } from "./lessonTeachers.model";

export class Teacher extends Model {
  static initModel(sequelize: Sequelize) {
    Teacher.init(
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
        tableName: "teachers",
        timestamps: false,
        indexes: [{ fields: ["name"] }],
      }
    );
  }

  static associateModels() {
    Teacher.belongsToMany(Lesson, {
      through: LessonTeachers,
      foreignKey: "teacher_id",
    });
  }
}
