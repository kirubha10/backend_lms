// Initilize express router
const connectDatabase = require("../config/dbConfig");
const logger = require("../logger");

exports.GetLocations = async (req, res) => {
  const { branch_id } = req.params;
  const query = `SELECT * FROM floor WHERE branch_id = ? AND status = 'active'`;
  const Auth = req.session.Auth;
  const connection = await connectDatabase(Auth);
  try {
    connection.query(query, [branch_id], (error, rows) => {
      if (error) {
        res
          .status(500)
          .json({ message: "Internal server error", status: "error" });
        logger.error("Error fetching book categories: ", error);
        return;
      }
      res.status(200).json({ status: "success", categories: rows });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error in GetLocations:", error);
  } finally {
    connection.end(); // Always release the connection, whether the query succeeds or fails.
  }
};

exports.AddLocation = async (req, res) => {
  const { block, shelf_name, rack_name, sub_rack_name, status, branch_id } =
    req.body;
  const query = `INSERT INTO lms_book_location (block,shelf_name,rack_name,sub_rack_name,status,branch_id) VALUES (?,?,?,?,?,?)`;
  const duplicateCheckQuery = `SELECT * FROM lms_book_location WHERE shelf_name = ? AND rack_name = ? AND sub_rack_name = ?`;
  const Auth = req.session.Auth;
  const connection = await connectDatabase(Auth);

  try {
    const duplicateCheckResult = await new Promise((resolve, reject) => {
      connection.query(
        duplicateCheckQuery,
        [shelf_name, rack_name, sub_rack_name],
        (error, rows) => {
          if (error) {
            reject(error);
          } else {
            resolve(rows);
          }
        }
      );
    });

    if (duplicateCheckResult.length > 0) {
      res.send({ message: "Location Already exists", status: "error" });
      return;
    }

    const insertResult = await new Promise((resolve, reject) => {
      connection.query(
        query,
        [block, shelf_name, rack_name, sub_rack_name, status, branch_id],
        (error, rows) => {
          if (error) {
            reject(error);
          } else {
            resolve(rows);
          }
        }
      );
    });

    res.status(200).json({
      message: "Location created successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error in AddLocation:", error);
  } finally {
    connection.end(); // Always release the connection, whether the query succeeds or fails.
  }
};

exports.GetBookLocation = async (req, res) => {
  const { branch_id } = req.params;
  const query = `SELECT * FROM lms_book_location WHERE branch_id = ?`;
  const Auth = req.session.Auth;
  const connection = await connectDatabase(Auth);
  try {
    connection.query(query, [branch_id], (error, rows) => {
      if (error) {
        res
          .status(500)
          .json({ message: "Internal server error", status: "error" });
        logger.error("Error fetching location: ", error);
      }
      res.status(200).json({ status: "success", location: rows });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error in GetBookLocation:", error);
  } finally {
    connection.end(); // Always release the connection, whether the query succeeds or fails.
  }
};

exports.UpdateLocation = async (req, res) => {
  const { block, shelf_name, rack_name, sub_rack_name, status } = req.body;
  const { id } = req.params;
  const query = `UPDATE lms_book_location SET block=?,shelf_name=?,rack_name=?,sub_rack_name=?,status=? WHERE id=?`;
  const Auth = req.session.Auth;
  const connection = await connectDatabase(Auth);
  try {
    connection.query(
      query,
      [block, shelf_name, rack_name, sub_rack_name, status, id],
      (error, rows) => {
        if (error) {
          res
            .status(500)
            .json({ message: "Internal server error", status: "error" });
          logger.error("Error updating location: ", error);
        }
        res.status(200).json({
          message: "Location updated successfully",
          status: "success",
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error in UpdateLocation:", error);
  } finally {
    connection.end(); // Always release the connection, whether the query succeeds or fails.
  }
};
