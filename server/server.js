/* eslint-disable no-unused-vars */
let express = require("express"),
  cors = require("cors"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser");

const app = express();

//Import Routes
const projectRoutes = require("./routes/project");
const authRoutes = require("./routes/auth");

//const { verifyToken } = require("./validation");

//Swagger Dependencies
const swaggerUI = require("swagger-ui-express");
const yaml = require("yamljs");

//SETUP Swagger
const swaggerDefinition = yaml.load("./swagger.yaml");
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDefinition));

// ENV File
require("dotenv-flow").config();

// parse request of content-type JSON
app.use(bodyParser.json());

// Connect MongoDB
mongoose
  .connect(process.env.DBHOST, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .catch((error) => console.log("Error connecting to MongoDB:" + error));
mongoose.connection.once("open", () =>
  console.log("Connected succesfully to MongoDB")
);

// CORS
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// API Routes Definition
//Welcome Route
app.get("/api/welcome", (req, res) => {
  res
    .status(200)
    .send({ message: "Welcome to the REST Project Management API" });
});
app.use("/api/project", projectRoutes);
app.use("/api/user", authRoutes);

// CREATE PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});

module.exports = app;
