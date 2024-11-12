module.exports = (sequelize, DataTypes) => {
  const SportsFacility = sequelize.define("SportsFacility", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    open_monday: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    close_monday: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    open_tuesday: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    close_tuesday: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    open_wednesday: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    close_wednesday: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    open_thursday: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    close_thursday: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    open_friday: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    close_friday: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    open_saturday: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    close_saturday: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    open_sunday: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    close_sunday: {
      type: DataTypes.TIME,
      allowNull: true,
    },
  });

  SportsFacility.associate = (models) => {
    SportsFacility.belongsTo(models.City, {
      foreignKey: {
        allowNull: false,
      },
    });
    SportsFacility.hasMany(models.Field, {
      foreignKey: "SportsFacilityId",
      as: "Fields",
    });
  };

  return SportsFacility;
};
