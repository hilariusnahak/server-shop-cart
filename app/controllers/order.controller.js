const db = require('../models')
const Order = db.orders

exports.findOrder = (req, res) => {
  const id = Number(req.params.id)

  Order.aggregate([{
    $match: {
      user_id: id
    }
  }, {
    $lookup: {
      from: "products",
      localField: "cart_items",
      foreignField: "code",
      as: "products"
    }
  }])
  .then((result) => {
    res.send(result)
  }).catch((err) => {
    res.status(409).send({
      message: err.message || "Some error while retrieving orders."
    })
  });
}

exports.addToCart = (req, res) => {
  const id = Number(req.params.id)
  const productCode = String(req.body.product)

  Order.updateOne({
    user_id: id
  }, {
    $addToSet: {
      cart_items: productCode
    }
  })
  .then((result) => {
    res.send(result)
  }).catch((err) => {
    res.status(409).send({
      message: err.message || "Some error while add to cart."
    })
  });
}

exports.removeFromCart = (req, res) => {
  const id = Number(req.params.id)
  const productCode = String(req.params.product)

  Order.updateOne({
    user_id: id
  }, {
    $pull: {
      cart_items: productCode
    }
  })
  .then((result) => {
    res.send(result)
  }).catch((err) => {
    res.status(409).send({
      message: err.message || "Some error while add to cart."
    })
  });
}