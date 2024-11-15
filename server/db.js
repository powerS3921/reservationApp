const { Sequelize } = require("sequelize");
const config = require("./config/config.json"); // ścieżka do Twojego config.json

// Wybieramy konfigurację w zależności od środowiska
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  timezone: dbConfig.timezone,
});

module.exports = sequelize;
