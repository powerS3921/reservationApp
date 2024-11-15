const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./src/swagger.js");
const cors = require("cors");
const cron = require("node-cron");
const { Reservation } = require("./models");
const { Op } = require("sequelize");

app.use(express.json());
app.use(cors());

const db = require("./models");

const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs.swaggerDocs));

const fieldRoutes = require("./routes/Fields");
app.use("/fields", fieldRoutes);

const reservationRoutes = require("./routes/Reservation");
app.use("/reservations", reservationRoutes);

const citiesRouter = require("./routes/City");
app.use("/api", citiesRouter);

const sportsRouter = require("./routes/Sport");
app.use("/api/sports", sportsRouter);

const fieldSizeRoutes = require("./routes/FieldSize.js");
app.use("/api/fieldSizes", fieldSizeRoutes);

const sportFacility = require("./routes/SportFacility.js");
app.use("/api/sportfacility", sportFacility);

const payment = require("./routes/Payment.js");
app.use("/", sportFacility);

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server runnig on port 3001");
  });
});

cron.schedule("*/5 * * * *", async () => {
  console.log("Sprawdzanie nieopłaconych rezerwacji starszych niż 30 minut...");

  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

  try {
    const deletedReservations = await Reservation.destroy({
      where: {
        czyZaplacono: false,
        createdAt: { [Op.lte]: thirtyMinutesAgo },
      },
    });

    console.log(`Usunięto ${deletedReservations} nieopłaconych rezerwacji starszych niż 30 minut.`);
  } catch (error) {
    console.error("Błąd podczas usuwania nieopłaconych rezerwacji:", error);
  }
});
