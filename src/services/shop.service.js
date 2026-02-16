const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// exports.findAll = async (filters) => {
//   try {
//     console.log("Filters:", filters);
//     // const { address, name, category } = filters;
//     // const where = {};

//     // if (address) where.address = { [Op.like]: `%${address}%` };
//     // if (name) where.name = { [Op.like]: `%${name}%` };
//     // if (category) where.category = { [Op.like]: `%${category}%` };

//     return Shop.findAll({
//       // where,
//       include: [
//         {
//           model: Food,
//           required: true,
//           where: {
//             shopId: { [Op.eq]: Sequelize.col("Shop.id") },
//           },
//         },
//       ],
//     });
//   } catch (error) {
//     throw error;
//   }
// };

exports.findAll = async (filters = {}) => {
  try {
    return await prisma.shops.findMany({
      where: {
        ...(filters.address && { address: { contains: filters.address } }),
        ...(filters.name && { name: { contains: filters.name } }),
        ...(filters.category && { category: { contains: filters.category } }),
      },
      include: {
        foods: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.search = async (filters = {}) => {
  try {
    return await prisma.shops.findMany({
      where: {
        OR: [
          { name: { contains: filters.text || "" } },
          { address: { contains: filters.text || "" } },
          { description: { contains: filters.text || "" } },
          { category: { contains: filters.text || "" } },
          { phone: { contains: filters.text || "" } },
          { email: { contains: filters.text || "" } },
        ],
        ...(filters.category && { category: { contains: filters.category } }),
      },
      include: {
        foods: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.findOne = async (id) => {
  try {
    return await prisma.shops.findUnique({
      where: { id: parseInt(id) },
      include: {
        foods: true,
      },
    });
  } catch (error) {
    throw error;
  }
};
