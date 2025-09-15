const mongoose = require("mongoose");
const accountmodel = require("../models/accountModel");

const viewAccounts = async (req, res) => {
  try {
    // Pagination query params

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const filter = search
      ? {
          $or: [
            { firstname: { $regex: search, $options: "i" } },
            { lastname: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Fetch accounts
    const [accounts, total] = await Promise.all([
      accountmodel
        .find(filter)
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      accountmodel.countDocuments(filter),
    ]);

    res.status(200).json({
      status: 200,
      message: "Accounts fetched successfully",
      data: accounts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Get accounts error:", err.message);
    res.status(500).json({
      status: 500,
      message: "Server error while fetching accounts",
    });
  }
};
const viewSingleAccount = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 400,
        message: "Account ID is required",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid account ID format",
      });
    }

    const account = await accountmodel.findById(id).select("-password");
    if (!account) {
      return res.status(404).json({
        status: 404,
        message: "Account not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Account fetched successfully",
      data: account,
    });
  } catch (err) {
    console.error("Get single account error:", err.message);
    res.status(500).json({
      status: 500,
      message: "Server error while fetching account",
    });
  }
};
const updateAccountStatus = async (req, res) => {
  try {
    const { id, status } = req.params;

    if (!id || !status) {
      return res.status(400).json({
        status: 400,
        message: "Account ID and status are required",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid account ID format",
      });
    }

    const allowedStatuses = ["active", "inactive", "deleted", "disabled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid status. Allowed: active, inactive, deleted, disabled",
      });
    }

    const account = await accountmodel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!account) {
      return res.status(404).json({
        status: 404,
        message: "Account not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Account status updated successfully",
      data: account,
    });
  } catch (err) {
    console.error("Update status error:", err.message);
    res.status(500).json({
      status: 500,
      message: "Server error while updating account status",
    });
  }
};

module.exports = {
  viewAccounts,
  viewSingleAccount,
  updateAccountStatus,
};
