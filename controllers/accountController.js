const accountmodel = require("../models/accountModel");
const addressmodel = require("../models/addressModel");
const bcrypt = require("bcryptjs");
const {
  passwordvalidate,
  validateaddress,
} = require("../middlewares/validateMeddleware");

const profile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized, please login first",
      });
    }

    // Fetch fresh user data from DB

    const account = await accountmodel
      .findById(req.user._id)
      .select("-password");
    if (!account) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Profile retrieved successfully",
      profile: account,
    });
  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(500).json({
      status: 500,
      message: "An error occurred while fetching profile",
    });
  }
};

const changepassword = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        status: 400,
        message: "Form field is required",
      });
    }
    const { error } = passwordvalidate.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }
    const user = req.user;
    const account = await accountmodel.findById(user._id);
    if (!account) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      account.password
    );
    if (!validPassword) {
      return res.status(401).json({
        status: 401,
        message: "Invalid password",
      });
    }
    account.password = req.body.newpassword;
    await account.save();
    res.status(200).json({
      status: 200,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};

const addaddress = async (req, res) => {
  try {
    const { title, address, phone } = req.body;

    if (!title || !address) {
      return res.status(400).json({
        status: 400,
        message: "Both title and address are required",
      });
    }

    const { error } = validateaddress.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized user",
      });
    }

    // if address already exists
    const exists = await addressmodel.findOne({
      addedby: user._id,
      address: address,
    });
    if (exists) {
      return res.status(409).json({
        status: 409,
        message: "This address already exists",
      });
    }

    // Save address
    const newAddress = await addressmodel.create({
      title,
      address,
      addedby: user._id,
    });

    res.status(201).json({
      status: 201,
      message: "Address added successfully",
      data: newAddress,
    });
  } catch (err) {
    console.error("Add address error:", err.message);
    return res.status(500).json({
      status: 500,
      message: "Server error while adding address",
    });
  }
};

const getAddresses = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized user",
      });
    }

    // Pagination support
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    // Fetch addresses belonging to this user
    const addresses = await addressmodel
      .find({ addedby: user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!addresses.length) {
      return res.status(404).json({
        status: 404,
        message: "No addresses found for this user",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Addresses fetched successfully",
      count: addresses.length,
      data: addresses,
    });
  } catch (err) {
    console.error("Get addresses error:", err.message);
    return res.status(500).json({
      status: 500,
      message: "Server error while fetching addresses",
    });
  }
};

const updateAddress = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        status: 400,
        message: "Address form is required",
      });
    }

    const { error } = validateaddress.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    if (!req.params?.id) {
      return res.status(400).json({
        status: 400,
        message: "Address ID is required",
      });
    }

    const user = req.user;

    const updatedAddress = await addressmodel.findOneAndUpdate(
      { _id: req.params.id, addedby: user._id },
      { $set: { title: req.body.title, address: req.body.address } },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        status: 404,
        message: "Address not found or not authorized",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (err) {
    console.error("Update address error:", err.message);
    return res.status(500).json({
      status: 500,
      message: "Server error while updating address",
    });
  }
};

module.exports = {
  profile,
  changepassword,
  addaddress,
  getAddresses,
  updateAddress,
};
