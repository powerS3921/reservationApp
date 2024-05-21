module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define("Reservation", {
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Reservation.associate = (models) => {
    Reservation.belongsTo(models.Field, {
      foreignKey: {
        allowNull: false,
      },
    });
    Reservation.belongsTo(models.Users, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Reservation;
};
