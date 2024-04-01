// Initilize express router
const util = require("util");
const connectDatabase = require("../config/dbConfig");
const logger = require("../logger");
const extractLetters = require("../hooks/extractLetter");

exports.BookQuantity = async (req, res) => {
  const {
    vendor_id,
    item_code,
    item_quantity,
    book_id,
    branch_id,
    book_category,
    book_name,
  } = req.body;

  const Auth = req.session.Auth;
  const connection = await connectDatabase(Auth);

  const query = util.promisify(connection.query).bind(connection);

  const generateBookDetails = (book_name, item_quantity) => {
    return Array.from({ length: item_quantity }, (_, i) => {
      const accession_no = extractLetters(book_name) + book_id;
      return {
        book_id:
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15),
        book_name,
        is_damaged: false,
        is_lost: false,
        is_available: true,
        is_issued: false,
        is_reserved: false,
        accession_no,
        accession_date: new Date(),
      };
    });
  };

  const bookDetails = generateBookDetails(book_category, item_quantity);

  const values = {
    book_id,
    damaged_count: 0,
    total_book: item_quantity,
    book_details: JSON.stringify(bookDetails),
  };

  try {
    await query(
      `INSERT INTO lms_quantity (vendor_id, item_code, item_quantity, book_id, branch_id) VALUES (?, ?, ?, ?, ?)`,
      [vendor_id, item_code, item_quantity, book_id, branch_id]
    );

    await query(
      `INSERT INTO lms_book_details (book_id, damaged_count, total_book, book_details) VALUES (?, ?, ?, ?)`,
      [book_id, 0, item_quantity, JSON.stringify(bookDetails)]
    );

    res.status(200).json({
      message: "Book Quantity Inserted Successfully",
      status: "success",
    });
  } catch (err) {
    logger.error(`Error in inserting book quantity: ${err.message}`);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      status: "error",
    });
  } finally {
    connection.end();
  }
};
exports.GetItemCode = async (req, res) => {
  const { book_id, branch_id } = req.params;
  const Auth = req.session.Auth;
  const connection = await connectDatabase(Auth);
  const query = `SELECT * FROM lms_quantity WHERE book_id = ? AND branch_id = ?`;
  try {
    connection.query(query, [book_id, branch_id], (err, result) => {
      if (err) {
        logger.error(`Error in getting item code: ${err}`);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (result.length === 0) {
        return res.status(200).json({ itemCode: "", duplicate: "false" });
      } else {
        return res.status(200).json({ itemCode: result, duplicate: "true" });
      }
    });
  } catch (err) {
    logger.error(`Error in getting item code: ${err}`);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    connection.end();
  }
};
