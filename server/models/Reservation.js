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
    sessionId: {
      type: DataTypes.STRING,
      allowNull: true, // Make this nullable in case a reservation does not involve a Stripe session
    },
    emailSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Default value: not sent
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
