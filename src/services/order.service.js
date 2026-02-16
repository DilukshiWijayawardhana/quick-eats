const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.findAll = async () => {
  return await prisma.orders.findMany({
    include: {
      orderproducts: {
        include: {
          foods: true,
          food_variants: true,
        },
      },
    },
  });
};

exports.search = async (query) => {
  return await prisma.orders.findMany({
    where: query,
    include: {
      orderproducts: {
        include: {
          foods: true,
          food_variants: true,
        },
      },
    },
  });
};

exports.save = async (orderData) => {
  const { customer, shop, status, orderProducts } = orderData;

  const shopExists = await prisma.shops.findUnique({
    where: { id: shop },
  });
  if (!shopExists) {
    throw new Error("Shop not found");
  }

  let totalPrice = 0;

  const productIds = orderProducts.map((item) => item.productId);
  const variantIds = orderProducts
    .map((item) => item.foodVariantId)
    .filter((id) => id !== null && id !== undefined);

  const products = await prisma.foods.findMany({
    where: { id: { in: productIds } },
  });
  const variants = await prisma.food_variants.findMany({
    where: { id: { in: variantIds } },
  });

  const productMap = products.reduce((acc, product) => {
    acc[product.id] = product.price;
    return acc;
  }, {});

  const variantMap = variants.reduce((acc, variant) => {
    acc[variant.id] = variant.price;
    return acc;
  }, {});

  for (const orderProduct of orderProducts) {
    let productPrice = 0;

    if (orderProduct.foodVariantId) {
      productPrice = variantMap[orderProduct.foodVariantId];
      if (productPrice === undefined) {
        throw new Error(
          `Food variant with id ${orderProduct.foodVariantId} not found!`
        );
      }
    } else {
      productPrice = productMap[orderProduct.productId];
      if (productPrice === undefined) {
        throw new Error(`Food with id ${orderProduct.productId} not found!`);
      }
    }

    totalPrice += productPrice * orderProduct.quantity;
  }

  const newOrder = await prisma.orders.create({
    data: {
      customer,
      shop,
      totalPrice,
      status,
      orderproducts: {
        create: orderProducts.map((orderProduct) => ({
          productId: orderProduct.productId,
          foodVariantId: orderProduct.foodVariantId || null,
          quantity: orderProduct.quantity,
          price: orderProduct.foodVariantId
            ? variantMap[orderProduct.foodVariantId]
            : productMap[orderProduct.productId],
        })),
      },
    },
    include: {
      orderproducts: true,
    },
  });

  return newOrder;
};
