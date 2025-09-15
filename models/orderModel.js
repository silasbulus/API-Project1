// const mongoose = require("mongoose");

// const orderschema = new mongoose.Schema({
//   address: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Address",
//     required: true,
//   },
//   orderid: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   deliverystatus: {
//     type: String,
//     enum: ["pending", "delivered", "running", "cancelled"],
//     default: "pending",
//   },
//   paidstatus: {
//     type: String,
//     default: "unpaid",
//   },
//   cart: [
//     {
//       _id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Cart",
//       },
//       product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//       },
//       quantity: {
//         type: Number,
//         required: true,
//       },
//       price: {
//         type: Number,
//         required: true,
//       },
//       addedby: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Account",
//       },
//     },
//   ],
//   account: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Account",
//     required: true,
//   },
//   trxref: {
//     type: String,
//   },
//   channel: {
//     type: String,
//   },
//   domain: {
//     type: String,
//   },
//   amountpaid: {
//     type: Number,
//   },
//   access_code: {
//     type: String,
//   },
//   reference: {
//     type: String,
//     unique: true,
//   },
//   amount: {
//     type: Number,
//   },
//   fees: {
//     type: Number,
//   },
//   status: {
//     type: String,
//     default: "pending",
//   },
//   paid_at: {
//     type: Date,
//   },
//   created_at: {
//     type: Date,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Order", orderschema);

const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    orderid: { type: String, required: true, unique: true },
    reference: { type: String },
    access_code: { type: String },
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        price: { type: Number },
        quantity: { type: Number },
        addedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "completed",
        "failed",
        "success",
      ],
      default: "pending",
    },
    paidstatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    domain: { type: String },
    fees: { type: Number },
    channel: { type: String },
    paid_at: { type: Date },
    created_at: { type: Date, default: Date.now },

    history: [
      {
        status: { type: String },
        note: { type: String },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);


module.exports = mongoose.model("Order", orderSchema);
