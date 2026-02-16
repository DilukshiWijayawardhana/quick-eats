const Joi = require("joi");
const ShopService = require("../services/shop.service");

exports.create = async (req, res, next) => {
  try {
    const shop = await ShopService.create(req.body);
    res.json(shop);
  } catch (error) {
    next(error);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const shops = await ShopService.findAll(req.query);
    res.json(shops);
  } catch (error) {
    next(error);
  }
};

const shopSearchSchema = Joi.object({
  text: Joi.string().allow(null, "").optional(),
  category: Joi.string().allow(null, "").optional(),
});

exports.search = async (req, res, next) => {
  try {
    const { value, error } = shopSearchSchema.validate(req.query);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const shops = await ShopService.search(value);
    res.json(shops);
  } catch (error) {
    next(error);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shop = await ShopService.findOne(id);
    res.json(shop);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shop = await ShopService.update(id, req.body);
    res.json(shop);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await ShopService.delete(id);
    res.json({ message: "Shop deleted successfully" });
  } catch (error) {
    next(error);
  }
};
