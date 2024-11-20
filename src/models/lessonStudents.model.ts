import { DataTypes, Model, Sequelize } from "sequelize";

export class LessonStudents extends Model {
  static initModel(sequelize: Sequelize) {
    LessonStudents.init(
      {
        lesson_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "lessons",
            key: "id",
          },
        },
        student_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "students",
            key: "id",
          },
        },
        visit: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: "lesson_students",
        timestamps: false,
        indexes: [
          { fields: ["lesson_id"] },
          { fields: ["student_id"] },
          { fields: ["visit"] },
        ],
      }
    );
  }

  static associateModels() {}
}
