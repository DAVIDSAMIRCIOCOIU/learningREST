const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');


/**Defines the extension of the file, the destination and the filename */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

/**Decides on the file extensions to be saved */
const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    // save file
    cb(null, true);
  } else {
    // Reject a file
    cb(null, false);
  }
}

//Initialize multer
// multer takes care of both req.file and req.body
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});



router.get("/", ProductsController.products_get_all);

// upload.single tries to parse only one file which is in the specified field: productImage
router.post("/", checkAuth, upload.single('productImage') , ProductsController.products_create_product);

// Handle Single products
router.get("/:productId", ProductsController.products_get_product);

router.patch("/:productId", checkAuth, ProductsController.products_update_product);

router.delete("/:productId", checkAuth, ProductsController.products_delete_product);

module.exports = router;
