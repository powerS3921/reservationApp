const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./src/swagger.js");
const cors = require("cors");

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

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server runnig on port 3001");
  });
});
