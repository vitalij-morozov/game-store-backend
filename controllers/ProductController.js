const ProductSchema = require('../schemas/ProductSchema');

const addNewProduct = async (req, res) => {
  try {
    console.log('req.body ===', req.body);
    const newGame = new ProductSchema(req.body);
    await newGame.save();
    return res.status(201).json({ error: false, message: 'Product added successfully' });
  } catch (error) {
    return res.status(404).json({ error: true, message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductSchema.find();
    return res.json({ error: false, data: products });
  } catch (error) {
    return res.status(404).json({ error: true, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { gameId } = req.params;
    console.log('gameId ===', gameId);
    const product = await ProductSchema.findOne({ id: gameId });
    return res.json({ error: false, data: product });
  } catch (error) {
    return res.status(404).json({ error: true, message: error.message });
  }
};

module.exports = {
  addNewProduct,
  getAllProducts,
  getProductById,
};
