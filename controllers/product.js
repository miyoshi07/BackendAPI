const Product = require("../models/Product");

module.exports.createProduct = async (req, res) => {
  const { name, description, price } = req.body;

  try {
    if (isNaN(price) || price <= 0) {
      return res.status(400).send({ error: "Price should be greater than 0" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
    });

    await newProduct.save();
    return res.status(201).send({ message: "Product successfully created" });
  } catch (error) {
    console.error("Error creating product:", error);
    return res
      .status(500)
      .send({ error: "Internal Server Error: Failed to create product" });
  }
};

module.exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (products.length > 0) {
      return res.status(200).send({ products });
    }

    return res.status(200).send({ message: "No products found" });
  } catch (error) {
    console.error("Error retrieving products: ", error);
    return res
      .status(500)
      .send({ error: "Internal Server Error: Failed to retrieve products" });
  }
};

module.exports.getAllActiveProducts = async (req, res) => {
  try {
    const activeProducts = await Product.find({ isActive: true });

    if (activeProducts.length > 0) {
      return res.status(200).send({ activeProducts });
    }

    return res.status(200).send({ message: "No active products found" });
  } catch (error) {
    console.error("Error retrieving active products: ", error);
    return res.status(500).send({
      error: "Internal Server Error: Failed to retrieve active products",
    });
  }
};

module.exports.getProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (product) {
      return res.status(200).send({ product });
    }

    return res.status(404).send({ error: "Product not found" });
  } catch (error) {
    console.error("Error retrieving specific product: ", error);
    return res.status(500).send({
      error: "Internal Server Error: Failed to retrieve specific product",
    });
  }
};

module.exports.updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, description, price } = req.body;

  try {
    if (isNaN(price) || price <= 0) {
      return res.status(400).send({ error: "Price should be greater than 0" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        price,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({ error: "Product not found" });
    }

    return res.status(200).send({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product: ", error);
    return res
      .status(500)
      .send({ error: "Internal Server Error : Failed to update product" });
  }
};

module.exports.archiveProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const archivedProduct = await Product.findByIdAndUpdate(
      productId,
      { isActive: false },
      { new: true }
    );

    if (!archivedProduct) {
      return res.status(404).send({ error: "Product not found" });
    }

    return res.status(200).send({
      message: "Product successfully archived",
      product: archivedProduct,
    });
  } catch (error) {
    console.error("Error archiving product: ", error);
    return res
      .status(500)
      .send({ error: "Internal Server Error: Failed to archive product" });
  }
};

module.exports.activateProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const activatedProduct = await Product.findByIdAndUpdate(
      productId,
      { isActive: true },
      { new: true }
    );

    if (!activatedProduct) {
      return res.status(404).send({ error: "Product not found" });
    }

    return res.status(200).send({
      message: "Product successfully activated",
      product: activatedProduct,
    });
  } catch (error) {
    console.error("Error activating product: ", error);
    return res
      .status(500)
      .send({ error: "Internal Server Error: Failed to activate product" });
  }
};
