const sql = require("mysql2");

async function connectDatabase(db_config) {
  const dyno_db = {
    user: db_config.DB_USER || process.env.DB_USER,
    host: db_config.DB_HOST || process.env.DB_HOST,
    database: db_config.DB_NAME || process.env.DB_NAME,
    password: db_config.DB_PASSWORD || process.env.DB_PASSWORD,
  };
  console.log("db_config", dyno_db);
  try {
    const connection = await sql.createConnection(dyno_db);
    console.log("Database connected!");
    connection.on("error", (error) => {
      console.error("Database error: ", error);
    });
    return connection;
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
}

module.exports = connectDatabase;
