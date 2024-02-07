const Product = require("../models/Product");

module.exports.createProduct = async (req, res) => {
  const { name, description, price } = req.body;

  try {
    const productExist = await Product.findOne({ name });

    if (productExist) {
      return res.status(400).send({ error: "Product already exist" });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).send({ error: "Price should be greater than 0" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
    });

    await newProduct.save();
    return res
      .status(201)
      .send({ message: "Product successfully created", product: newProduct });
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
    const productExist = await Product.find({ name });

    if (
      productExist &&
      productExist.some((p) => p._id.toString() !== productId)
    ) {
      return res.status(400).send({ error: "Product name already exist" });
    }

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

module.exports.searchProductByName = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name || (name && name.trim() === "")) {
      return res.status(400).send({ error: "Product name cannot be empty" });
    }

    // Wild card search
    // const products = await Product.find({ name: {
    //   $regex: name,
    //   $options: "i"
    // }});

    const products = await Product.find({ name });

    if (products.length === 0) {
      return res
        .status(200)
        .send({ message: `Unable to find product with name: ${name}` });
    }

    return res.status(200).send({ products });
  } catch (error) {
    console.error("Error searching by product name: ", error);
    return res.status(500).send({
      error: "Internal Server Error: Failed to search product by name",
    });
  }
};

module.exports.searchProductByPrice = async (req, res) => {
  const { minPrice, maxPrice } = req.body;

  try {
    if (isNaN(minPrice) || isNaN(maxPrice) || minPrice === "" || maxPrice === "") {
      return res
        .status(400)
        .send({ error: "Min and Max Price should be valid numeric values" });
    }

    if (minPrice < 0 || maxPrice < 0) {
      return res
        .status(400)
        .send({ error: "Min and Max Price should be greater than 0" });
    }

    if (minPrice > maxPrice) {
      return res.status(400).send({ error: "Min Price cannot be greater than Max Price"})
    }

    const products = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice }
    });

    if (products.length === 0) {
      return res.status(200).send({ message: "No product found within the given price range"});
    }

    return res.status(200).send({ products });
  } catch (error) {
    console.error("Error finding products within the given price range: ", error);
    return res.status(500).send({ error: "Internal Server Error: Failed to find products within the given price range"});
  }
};