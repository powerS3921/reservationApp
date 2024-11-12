module.exports = (sequelize, DataTypes) => {
  const FieldSize = sequelize.define("FieldSize", {
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    SportId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Sports",
        key: "id",
      },
    },
  });

  FieldSize.associate = (models) => {
    FieldSize.belongsTo(models.Sport, {
      foreignKey: "SportId",
      as: "sport",
    });
  };

  return FieldSize;
};
