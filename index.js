const Express = require("express");
const cookieSession = require("cookie-session");
const path = require("path");
const BodyParser = require("body-parser");
const cors = require("cors");
const Http = require("http");
// const { initializeSocket } = require("./socket/socket");
const fileUpload = require("express-fileupload");
const logger = require("./logger");
require("dotenv").config();

const MasterRouter = require("./config/routes");

const app = Express();
const server = Http.createServer(app);
// initializeSocket(server);
// app.use(cors({ origin: "*" }));
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost",
    "http://13.58.217.203:3003",
    "http://13.58.217.203:3000",
  ],
  // origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "keyboardcat"],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: false, // Set to true if using HTTPS
    httpOnly: false,
    sameSite: "lax", //lax,sameSite: "none", secure: true
    // Add other cookie options as needed
  })
);
app.use(Express.static(path.join(__dirname, "build")));

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/upload", Express.static("upload"));

app.use("/api", MasterRouter);
// Error handling middleware
app.use((err, req, res, next) => {
  // Log the error
  console.error(err);
  logger.error(err);

  // Send an appropriate response to the client
  res.status(500).send("Something went wrong!");
});
app.use((req, res, next) => {
  console.log("Session:", req.session);
  next();
});
// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  logger.error(err);

  // Optionally, you might want to gracefully close your server or perform cleanup here
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  logger.error(reason);
});

process.env.NODE_ENV === "production"
  ? (PORT = process.env.PROD_PORT)
  : (PORT = process.env.DEV_PORT);

server.listen(PORT, () => {
  console.log(`App running on ${process.env.NODE_ENV} port ${PORT}.`);
});
