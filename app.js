/* Requires */
const express = require("express");
// DB
const db = require("./db/models");
const cors = require("cors");
// Passport
const passport = require("passport");
// Passport Strategies
const { localStrategy, jwtStrategy } = require("./middleware/passport");
/* Requires */

// Routes
const userRoutes = require("./API/users/routes");
const profileRoutes = require("./API/profiles/routes");

// Path
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Passport Setup
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

// Routes
app.use(userRoutes);
app.use("/profiles", profileRoutes);

// Path Not Found
app.use((req, res) => {
  res.status(404).json({ message: "PATH NOT FOUND" });
});

// Handling Errors
app.use((err, req, res, next) => {
  res.status(err.status ?? 500);
  res.json({ message: err.message ?? "Internal Server Error" });
});

const run = async () => {
  try {
    await db.sequelize.sync({ alter: true });
    // await db.sequelize.sync({ force: true });
    console.log("Connection to the database successful!");

    await app.listen(8000, () => {
      console.log("The application is running on localhost:8000");
    });
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
};

run();
