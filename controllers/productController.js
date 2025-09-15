const productmodel = require("../models/productModel");
const cloudinary = require("cloudinary").v2;
const cartmodel = require("../models/cartModel");
const usermodel = require("../models/userModel");
const escapeRegex = require("../utils/regex");
const wishlistmodel = require("../models/wishlistModel");
const { uniquename, generatesku } = require("../middlewares/uniqueMeddleware");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      longdescription,
      shortdescription,
      prescriptionRequired,
      stock,
      category,
      amount,
    } = req.body;

    let files = [];
    if (req.file) {
      files = [req.file];
    } else if (req.files && Array.isArray(req.files)) {
      files = req.files;
    } else if (req.files && req.files.images) {
      files = req.files.images;
    }

    if (!files || files.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "Product images are required",
      });
    }
    const productimages = files.map((file) => file.path);
    const displayimg = productimages[0];

    const sku = await generatesku();
    const productcategory = JSON.parse(category);

    await productmodel.create({
      name,
      price,
      longdescription,
      shortdescription,
      stock,
      amount,
      category: productcategory,
      prescriptionRequired: prescriptionRequired || false,
      displayimg,
      images: productimages,
      sku,
      addedby: req.user._id,
    });

    if (stock < (req.body.lowStockThreshold || 10)) {
      console.warn(`⚠️ Low stock alert for ${name} (Stock: ${stock})`);
    }

    return res.status(201).json({
      status: 201,
      message: "Product uploaded successfully",
    });
  } catch (err) {
    console.error("Error uploading product:", err);
    return res.status(500).json({
      status: 500,
      message: "Error occurred while uploading product",
    });
  }
};
const retrieveProduct = async (req, res) => {
  try {
    const products = await productmodel
      .find({ active: true })
      .populate("addedby", "-password");

    return res.status(200).json({
      status: 200,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Error occured while fetching products",
    });
  }
};
const productDetails = async (req, res) => {
  try {
    const { sku } = req.params;
    const product = await productmodel
      .findOne({ sku: sku })
      .populate("addedby", "-password");
    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Product found",
      product,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Error occured while fetching product",
    });
  }
};
const filterproduct = async (req, res) => {
  try {
    const { name, category } = req.query;

    let filter = {};
    if (name) {
      filter.name = { $regex: escapeRegex(name), $options: "i" };
    }
    if (category) {
      filter.category = { $regex: escapeRegex(category), $options: "i" };
    }

    const products = await productmodel.find(filter);
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({
      status: 500,
      message: "Error fetching products",
    });
  }
};
const updateProduct = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "admin" && user.role !== "manager") {
      return res.status(403).json({
        status: 403,
        message: "Forbidden, only admin can disable products",
      });
    }
    const { sku } = req.params;

    const product = await productmodel.findOne({ sku: sku });
    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }
    product.active = !product.active;
    await product.save();
    return res.status(200).json({
      status: 200,
      message: "Product status updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Error occured while updating product status",
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { sku } = req.params;

    const product = await productmodel.findOneAndDelete({ sku });

    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Error occurred while deleting product",
    });
  }
};

const addcart = async (req, res) => {
  try {
    const { sku } = req.params;
    const { quantity } = req.body;

    if (!sku) {
      return res.status(400).json({
        status: 400,
        message: "Product sku is required",
      });
    }
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        status: 400,
        message: "Product quantity must be greater than 0",
      });
    }

    const product = await productmodel.findOne({ sku });
    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }

    const cart = await cartmodel.findOneAndUpdate(
      { addedby: req.user._id, product: product._id },
      { $inc: { quantity: Number(quantity) } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      status: 200,
      message: "Product added/updated in cart successfully",
      cart,
    });
  } catch (err) {
    console.error("Error in addcart:", err);
    return res.status(500).json({
      status: 500,
      message: "Error occurred while adding to cart",
    });
  }
};
const fetchcart = async (req, res) => {
  try {
    const cartItems = await cartmodel
      .find({ addedby: req.user._id, status: "active" })
      .lean();

    if (!cartItems.length) {
      return res.status(200).json({
        status: 200,
        message: "Cart is empty",
        data: [],
      });
    }

    const data = await Promise.all(
      cartItems.map(async (item) => {
        const product = await productmodel.findById(item.product).lean();
        const user = await usermodel
          .findById(item.addedby)
          .select("-password")
          .lean();

        return {
          ...item,
          product,
          addedby: user,
        };
      })
    );

    return res.status(200).json({
      status: 200,
      message: "Cart fetched successfully",
      data,
    });
  } catch (err) {
    console.error("Error in fetchcart:", err);
    return res.status(500).json({
      status: 500,
      message: "Error occurred while fetching cart",
    });
  }
};
const deletecart = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 400,
        message: "Cart ID is required",
      });
    }

    const cart = await cartmodel.findById(id);
    if (!cart) {
      return res.status(404).json({
        status: 404,
        message: "Cart not found",
      });
    }
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      if (cart.addedby.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: 403,
          message: "Forbidden: You are not authorized to delete this cart",
        });
      }
    }

    await cartmodel.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: req.user._id,
      status: "inactive",
    });

    return res.status(200).json({
      status: 200,
      message: "Cart marked as deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting cart:", err);
    return res.status(500).json({
      status: 500,
      message: "Error occurred while deleting cart",
    });
  }
};

const addwish = async (req, res) => {
  try {
    const { sku } = req.params;

    if (!sku) {
      return res.status(400).json({
        status: 400,
        message: "Product sku is required",
      });
    }

    const product = await productmodel.findOne({ sku });
    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }

    const wishlist = await wishlistmodel.findOneAndUpdate(
      {
        addedby: req.user._id,
        product: product._id,
      },
      {
        $setOnInsert: {
          addedby: req.user._id,
          product: product._id,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    const existed = await wishlistmodel.countDocuments({
      addedby: req.user._id,
      product: product._id,
    });

    if (existed > 1) {
      return res.status(409).json({
        status: 409,
        message: "Product already exists in wishlist",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Product added to wishlist successfully",
      data: wishlist,
    });
  } catch (err) {
    console.error("Error in addwish:", err);
    return res.status(500).json({
      status: 500,
      message: "Error occurred while adding to wishlist",
    });
  }
};
const fetchwishlist = async (req, res) => {
  try {
    const wishlist = await wishlistmodel
      .find({ addedby: req.user._id })
      .populate({
        path: "product",
        select: "name price image",
      })
      .populate({
        path: "addedby",
        select: "-password",
      })
      .lean()
      .exec();

    return res.status(200).json({
      status: 200,
      message: "Wishlist fetched successfully",
      data: wishlist,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Error occurred while fetching wishlist",
    });
  }
};
const deletewish = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!id) {
      return res.status(400).json({
        status: 400,
        message: "Wish id is required",
      });
    }

    const wish = await wishlistmodel.findById(id);

    if (!wish) {
      return res.status(404).json({
        status: 404,
        message: "Wish not found",
      });
    }

    if (
      user.role !== "admin" &&
      user.role !== "manager" &&
      wish.addedby.toString() !== user._id.toString()
    ) {
      return res.status(403).json({
        status: 403,
        message: "Forbidden, you are not authorized to delete this wish",
      });
    }

    await wishlistmodel.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: user._id,
    });

    return res.status(200).json({
      status: 200,
      message: "Wish deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Error occurred while deleting wish",
    });
  }
};

module.exports = {
  createProduct,
  retrieveProduct,
  updateProduct,
  filterproduct,
  productDetails,
  deleteProduct,

  addcart,
  fetchcart,
  deletecart,
  addwish,
  fetchwishlist,
  deletewish,
};
