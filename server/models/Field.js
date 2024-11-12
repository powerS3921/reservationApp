module.exports = (sequelize, DataTypes) => {
  const Field = sequelize.define("Field", {
    sizeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    SportsFacilityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "SportsFacilities", // Refer to SportsFacility model
        key: "id",
      },
    },
  });

  Field.associate = (models) => {
    Field.belongsTo(models.Sport, {
      foreignKey: { allowNull: false },
    });
    Field.belongsTo(models.FieldSize, {
      foreignKey: "sizeId",
      as: "fieldSize",
    });
    Field.belongsTo(models.SportsFacility, {
      foreignKey: "SportsFacilityId",
      as: "sportsFacility",
    });
    Field.hasMany(models.Reservation, {
      foreignKey: "FieldId",
      as: "Reservations",
    });
  };

  return Field;
};
