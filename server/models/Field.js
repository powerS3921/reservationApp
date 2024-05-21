module.exports = (sequelize, DataTypes) => {
  const Field = sequelize.define("Field", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Field.associate = (models) => {
    Field.hasMany(models.Reservation, {
      onDelete: "cascade",
    });
  };

  return Field;
};
