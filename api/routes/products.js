const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
  .select('name price _id')
  .exec()
  .then(docs => {
    // Set the response object
    const response = {
      count: docs.length,
      products: docs.map(doc => {
        // modify each object that will be returned in the array to have additional props
        return {
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          request: {
            type: 'GET',
            url: 'https//localhost:3000/products/' + doc._id
          }
        }
      })
    }
      res.status(200).json(response);
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    })
  })
});

router.post("/", (req, res, next) => {
  console.log(req.body.name);
  // The below setup doesn't allow to add new fields as
  // we configure the product and never extract any extra props (never assign with req.body.propHere)
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created product",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'https//localhost:3000/products/' + result._id
          }
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
});

// Handle Single products
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  // I don't need to create a new Product object:
  // I will call a static method on the obj:
  // “Static methods are called without instantiating their
  //class and are also not callable when the class is instantiated
  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log(doc);
      if(doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({message: "No valid entry found for provided ID"})
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  // Check for requested props (not able to add new ones)
  const updateOps = {};
    for(let ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
  Product.update({_id: id}, {$set: updateOps})
  .exec()
  .then(result => {
    console.log(result);
    res.status(200).json(result);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({_id: id})
  .exec()
  .then(result => {
    res.status(200).json(result);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  });
});

module.exports = router;
