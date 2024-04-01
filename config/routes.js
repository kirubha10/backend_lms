const Express = require("express");
const router = Express.Router();
const path = require("path");
const fs = require("fs");

const BookController = require("../controller/book.controller");
const userController = require("../controller/user.controller");
const locationController = require("../controller/location.controller");
const storeController = require("../controller/store.controller");

router.get("/users/:userId/campus/:campus_name", userController.users);

router.post("/create-book-category", BookController.CreateBookCategory);
router.get(
  "/get-all-book-categories/:branch_id",
  BookController.GetAllBookCategories
);
router.post("/get-book-category/:id", BookController.GetBookCategory);
router.put("/update-book-category/:id", BookController.UpdateBookCategory);
router.post("/upload-bulk-category", BookController.UploadBulkCategory);

router.post("/create-book-location", locationController.AddLocation);
router.get("/get-all-locations/:branch_id", locationController.GetBookLocation);
router.get("/get-blocks/:branch_id", locationController.GetLocations);
router.put("/update-book-location/:id", locationController.UpdateLocation);

router.post("/create-book", BookController.AddBook);
router.get("/get-all-books/:branch_id", BookController.GetBooks);
router.put("/update-book/:id", BookController.UpdateBooks);

router.get("/get-departments/:branch_id", BookController.GetDepartment);
router.get("/get-programs/:branch_id", BookController.GetPrograms);
router.get("/get-program-years/:branch_id", BookController.GetProgramYear);
router.get("/get-vendors/:branch_id", BookController.GetVendor);
router.get("/get-subjects/:branch_id", BookController.GetSubjectList);
router.get("/get-languages", BookController.GetLanguages);

router.post("/create-book-quantity", storeController.BookQuantity);
router.get("/get-item-code", storeController.GetItemCode);

router.use("/static", Express.static(path.join(__dirname, "sample_file")));

router.get("/download/:file_name/extension/:ext", BookController.DownloadFile);
router.post("/upload-category", BookController.UploadBulkCategory);
router.post("/upload-location", BookController.UploadBulkLocation);
router.get("/inactive-types/:id/:type/:status", BookController.MakeInactive);

module.exports = router;
