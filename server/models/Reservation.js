module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define("Reservation", {
    reservationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    czyZaplacono: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });

  // Associations
  Reservation.associate = (models) => {
    Reservation.belongsTo(models.Field, { foreignKey: { allowNull: false } });
    Reservation.belongsTo(models.Users, { foreignKey: { allowNull: false } });
  };

  return Reservation;
};
