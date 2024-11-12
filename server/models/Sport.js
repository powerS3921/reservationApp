module.exports = (sequelize, DataTypes) => {
  const Sport = sequelize.define("Sport", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Sport.associate = (models) => {
    Sport.hasMany(models.Field, {
      foreignKey: {
        allowNull: false,
      },
    });

    Sport.hasMany(models.FieldSize, {
      foreignKey: "SportId",
      as: "fieldSizes",
    });
  };

  return Sport;
};
