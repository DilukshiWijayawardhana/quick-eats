const uploader = require("./uploader.service");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.save = async (file, name, price, description, stock, shopId) => {
  if (!file) {
    throw new Error("File is required");
  }

  let productImage = await uploader.upload(file);

  const shop = await prisma.shops.findUnique({
    where: { id: shopId },
  });
  if (!shop) {
    throw new Error("Shop not found");
  }

  const food = await prisma.foods.create({
    data: {
      name,
      price,
      description,
      image: productImage,
      stock,
      shop_id: shopId,
    },
  });

  return await prisma.foods.findMany({
    where: { shop_id: shopId },
  });
};

exports.findAll = async (shopId) => {
  return await prisma.foods.findMany({
    where: { shop_id: shopId },
  });
};

exports.foodSearch = async (name) => {
  try {
    return await prisma.foods.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      include: {
        shops: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        food_variants: {
          select: {
            size: true,
            price: true,
            spiciness: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Search Error:", error);
    throw error;
  }
};

exports.findOne = async (id) => {
  return await prisma.foods.findUnique({
    where: { id },
  });
};

exports.update = async (id, data) => {
  const food = await prisma.foods.findUnique({
    where: { id },
  });
  if (!food) {
    throw new Error("Food not found");
  }

  if (data.file) {
    data.image = await uploader.upload(data.file);
  }

  const updatedFood = await prisma.foods.update({
    where: { id },
    data: {
      name: data.name,
      price: data.price,
      description: data.description,
      stock: data.stock,
      image: data.image,
    },
  });

  return updatedFood;
};

exports.delete = async (id) => {
  const food = await prisma.foods.findUnique({
    where: { id },
  });
  if (!food) {
    throw new Error("Food not found");
  }

  await prisma.foods.delete({
    where: { id },
  });

  return { message: "Food deleted successfully" };
};
