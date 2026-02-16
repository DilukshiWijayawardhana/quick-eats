const OrderService = require("../services/order.service");
const Joi = require("joi");

exports.findAll = async (req, res, next) => {
  try {
    const orders = await OrderService.findAll();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const query = req.query;
    const orders = await OrderService.search(query);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const orderSchema = Joi.object({
  customer: Joi.number().integer().required(),
  shop: Joi.number().integer().required(),
  status: Joi.string()
    .valid("Pending", "Completed", "Cancelled")
    .default("Pending"),
  orderProducts: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().required(),
        foodVariantId: Joi.number().integer().allow(null).default(null),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .required(),
});

exports.save = async (req, res, next) => {
  try {
    const { error } = orderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const orderData = req.body;
    const newOrder = await OrderService.save(orderData);

    res.status(201).json({
      message: "Order placed successfully!",
      order: newOrder,
    });
  } catch (error) {
    next(error);
  }
};
