const connectDatabase = require("../config/dbConfig");
const DateGenerator = require("../hooks/date");
const logger = require("../logger");

exports.users = async (req, res) => {
  const { userId, campus_name } = req.params;
  logger.info(userId);
  const date = DateGenerator();

  const Auth = req.session.Auth;
  console.log("Users Auth", Auth);
  if (Auth === undefined || Auth === "undefined") {
    const master_connection_config = {
      DB_USER: process.env.DB_USER,
      DB_HOST: process.env.DB_HOST,
      DB_NAME: process.env.DB_NAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
    };
    const connection = await connectDatabase(master_connection_config);
    connection.query(
      `SELECT * FROM  clients WHERE client_name='${campus_name}'`,
      async (err, result) => {
        if (err) {
          logger.error(err);
        }
        if (result.length > 0) {
          const connection_config = {
            DB_USER: result[0].db_user,
            DB_HOST: "13.58.144.48",
            DB_NAME: result[0].client_db,
            DB_PASSWORD: result[0].db_password,
          };
          req.session.Auth = connection_config;
          const connect = await connectDatabase(connection_config);
          connect.query(
            `SELECT hms_logged_in_user.*, application_users.first_name
            FROM hms_logged_in_user
            LEFT JOIN application_users ON hms_logged_in_user.user_id = application_users.person_id
            WHERE hms_logged_in_user.user_id = '${userId}' AND hms_logged_in_user.date = '${date}'`,
            (err, result) => {
              if (err) {
                logger.error(err);
              }
              if (result) {
                logger.info("User List", result);
                res.send({
                  data: result[0],
                  message: "User List",
                  status: "success",
                });
              } else {
                res.send({ message: "UnAuthorised user", status: "error" });
              }
            }
          );
        }
      }
    );
  } else {
    const connect = await connectDatabase(Auth);
    connect.query(
      `SELECT hms_logged_in_user.*, application_users.first_name
      FROM hms_logged_in_user
      LEFT JOIN application_users ON hms_logged_in_user.user_id = application_users.person_id
      WHERE hms_logged_in_user.user_id = '${userId}' AND hms_logged_in_user.date = '${date}'`,
      (err, result) => {
        if (err) {
          logger.error(err);
        }
        if (result) {
          res.send({
            data: result[0],
            message: "User List",
            status: "success",
          });
        } else {
          res.send({ message: "UnAuthorised user", status: "error" });
        }
      }
    );
  }
};
