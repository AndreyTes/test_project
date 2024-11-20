import { DataTypes, Model, Sequelize } from "sequelize";

export class LessonTeachers extends Model {
  static initModel(sequelize: Sequelize) {
    LessonTeachers.init(
      {
        lesson_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "lessons",
            key: "id",
          },
        },
        teacher_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "teachers",
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "lesson_teachers",
        timestamps: false,
        indexes: [{ fields: ["lesson_id"] }, { fields: ["teacher_id"] }],
      }
    );
  }

  static associateModels() {}
}
