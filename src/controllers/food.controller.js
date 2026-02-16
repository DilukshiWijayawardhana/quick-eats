const FoodService = require("../services/food.service");
const Joi = require("joi");

exports.save = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const { name, price, description, stock, shopId } = req.body;

    const foods = await FoodService.save(
      req.file,
      name,
      parseFloat(price),
      description,
      parseInt(stock),
      parseInt(shopId)
    );

    res.json(foods);
  } catch (error) {
    next(error);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const { shopId } = req.query;
    const foods = await FoodService.findAll(parseInt(shopId));
    res.status(200).json(foods);
  } catch (error) {
    next(error);
  }
};

const foodSearchSchema = Joi.object({
  name: Joi.string().required(),
});

exports.foodSearch = async (req, res, next) => {
  try {
    const { value, error } = foodSearchSchema.validate(req.query);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const foods = await FoodService.foodSearch(value.name);
    res.status(200).json(foods);
  } catch (error) {
    next(error);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const food = await FoodService.findOne(parseInt(id));
    res.status(200).json(food);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (req.file) {
      data.file = req.file;
    }
    const food = await FoodService.update(parseInt(id), data);
    res.status(200).json(food);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await FoodService.delete(parseInt(id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
