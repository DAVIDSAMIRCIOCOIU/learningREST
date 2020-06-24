const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling GET req to /products",
  });
});

router.post("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling POST req to /products",
  });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  if (id === "special") {
    res.status(200).json({
      message: "you discovered the special id",
      id: id,
    });
  } else {
    res.status(200).json({
      message: "you passed an id",
    });
  }
});

router.patch("/:productId", (req, res, next) => {
  res.status(200).json({
    message: "updated product",
  });
});

router.delete("/:productId", (req, res, next) => {
  res.status(200).json({
    message: "deleted product",
  });
});

module.exports = router;
