const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");

exports.orders_get_all = (req, res, next) => {
  // Check for user role
  if (req.userData.role === "admin") {
    Order.find()
      .select("product quantity _id")
      // pass in the ref property and optionally a list of the props of this object
      .populate("product", "name")
      .exec()
      .then((docs) => {
        res.status(200).json({
          count: docs.length,
          orders: docs.map((doc) => {
            return {
              _id: doc._id,
              product: doc.product,
              quantity: doc.quantity,
              request: {
                type: "GET",
                url: "http://localhost:3000/orders." + doc._id,
              },
            };
          }),
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  } else if (req.userData.role === "customer") {
    Order.find({ user: req.userData.userId })
      .select("product quantity _id user")
      // pass in the ref property and optionally a list of the props of this object
      .populate("product", "name")
      .exec()
      .then((docs) => {
        res.status(200).json({
          count: docs.length,
          orders: docs.map((doc) => {
            return {
              _id: doc._id,
              product: doc.product,
              quantity: doc.quantity,
              user: doc.user,
              request: {
                type: "GET",
                url: "http://localhost:3000/orders." + doc._id,
              },
            };
          }),
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }
};

exports.orders_create_order = (req, res, next) => {
  console.log(req.userData.userId);
  // Check if we have a product for a given id
  Product.findById(req.body.productId)
    .then((prod) => {
      // check against null (if product not found)
      if (!prod) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      // else create a new order and save it (saving will return a promise)
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
        user: req.userData.userId,
      });
      return order.save();
    })
    // then and catch are provided as default values but they are not real promises that is why we use exec
    // not that here we do not use exec beacuse save gives back a real promise
    .then((result) => {
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
          user: result.user,
        },
        request: {
          type: "GET",
          url: "https://localhost:3000/orders/" + result._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Product not found",
        error: err,
      });
    });
};

exports.orders_get_order = (req, res, next) => {
  // Check for user role
  if (req.userData.role === "admin") {
    Order.findById(req.params.orderId)
      .populate("product")
      .exec()
      .then((order) => {
        // check against null order (a null order will alwayes be returned even if there is no order)
        if (!order) {
          return res.status(404).json({
            message: "Order not found",
          });
        }
        res.status(200).json({
          order: order,
          request: {
            message: "get all orders",
            type: "GET",
            url: "http://localhost:3000/orders",
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } else if (req.userData.role === "customer") {
    console.log(req.userData.userId)
    Order.findById(req.params.orderId)
    .where('user').equals(req.userData.userId)
      .populate("product")
      .exec()
      .then((order) => {
        // check against null order (a null order will alwayes be returned even if there is no order)
        if (!order) {
          return res.status(404).json({
            message: "Order not found",
          });
        }
        res.status(200).json({
          order: order,
          request: {
            message: "get all orders",
            type: "GET",
            url: "http://localhost:3000/orders",
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
};

exports.orders_delete_order = (req, res, next) => {
  // Check for user role
  if (req.userData.role === "admin") {
    Order.remove({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "http://localhost/3000/orders",
          body: { productId: "ID", quantity: "Number" },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
  } else if(req.userData.role === "customer") {
    Order.remove({ _id: req.params.orderId })
    .where('user').equals(req.userData.userId)
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "http://localhost/3000/orders",
          body: { productId: "ID", quantity: "Number" },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
  }
 
};
