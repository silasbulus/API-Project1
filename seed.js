// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const dotenv = require("dotenv");
// dotenv.config();

// const Product = require("./models/productModel");
// const Account = require("./models/accountModel");
// const Order = require("./models/orderModel");

// const seedData = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log("🌍 Connected to MongoDB");

//     // ✅ Clear collections BEFORE inserting
//     await Account.deleteMany({});
//     await Product.deleteMany({});
//     await Order.deleteMany({});
//     console.log("🧹 Old data cleared");

//     // ✅ Create users (with hashed passwords)
//     const users = await Account.insertMany([
//       {
//         firstname: "silas",
//         lastname: "bulus",
//         email: "silasbulu2@gmail.com",
//         password: await bcrypt.hash("Silas1510@", 10),
//         role: "user",
//         image: "https://via.placeholder.com/150",
//       },
//       {
//         firstname: "silas",
//         lastname: "bulus",
//         email: "bulussilas26@gmail.com",
//         password: await bcrypt.hash("Bulus1510@", 10),
//         role: "admin",
//         image: "https://via.placeholder.com/150",
//       },
//     ]);

//     console.log(
//       "👤 Users seeded:",
//       users.map((u) => u.email)
//     );

//     const admin = users.find((u) => u.role === "admin");
//     const user = users.find((u) => u.role === "user");

//     // ✅ Create products
//     const products = await Product.insertMany([
//       {
//         name: "paracetamol",
//         description: "Fast-acting pain reliever and fever reducer.",
//         price: 1200,
//         quantity: 10,
//         stock: 50,
//         lowStockThreshold: 3,
//         expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 12)),
//         sku: "SKU-001",
//         displayimg: "https://via.placeholder.com/300",
//         shortdescription: "This is a short description",
//         longdescription: "This is a longer description of the sample product.",
//         category: "antibiotics",
//         addedby: admin._id,
//       },
//       {
//         name: "nFERTILAID FOR MEN CAPS X90\n",
//         description: "Fast-acting pain reliever and fever reducer.",
//         price: 800,
//         quantity: 15,
//         stock: 50,
//         lowStockThreshold: 5,
//         expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
//         sku: "SKU-002",
//         displayimg: "https://via.placeholder.com/300",
//         shortdescription: "Another short description",
//         longdescription: "This is another longer description",
//         category: "syrup",
//         addedby: admin._id,
//       },
//       {
//         name: "nFERTILAID FOR MEN CAPS X90\n",
//         description: "good for protection",
//         price: 200,
//         quantity: 20,
//         stock: 50,
//         lowStockThreshold: 4,
//         expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 18)),
//         sku: "SKU-003",
//         displayimg: "https://via.placeholder.com/300",
//         shortdescription: "This is a short description",
//         longdescription: "This is a longer description of the sample product.",
//         category: "syrup",
//         addedby: admin._id,
//       },
//     ]);

//     console.log(
//       "📦 Products seeded:",
//       products.map((p) => `${p.name} ($${p.price})`)
//     );

//     // ✅ Calculate total amount safely
//     const totalAmount =
//       (products[0]?.price || 0) * 1 + (products[1]?.price || 0) * 2;

//     // ✅ Create a test order
//     const order = await Order.create({
//       account: user._id,
//       cart: [
//         {
//           product: products[0]._id,
//           quantity: 1,
//           price: products[0].price,
//           addedby: user._id,
//         },
//         {
//           product: products[1]._id,
//           quantity: 2,
//           price: products[1].price,
//           addedby: user._id,
//         },
//       ],
//       amount: totalAmount,
//       reference: "TEST-REF-001",
//       orderid: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//       status: "pending",
//       paidstatus: "unpaid",
//     });

//     console.log("🛒 Order seeded:", order._id);

//     console.log("✅ Seeding completed successfully");
//     process.exit();
//   } catch (err) {
//     console.error("❌ Seeding error:", err);
//     process.exit(1);
//   }
// };

// seedData();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const Product = require("./models/productModel");
const Account = require("./models/accountModel");
const Order = require("./models/orderModel");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🌍 Connected to MongoDB");

    let user = await Account.findOne({ email: "silasbulu2@gmail.com" });
    if (!user) {
      user = await Account.create({
        firstname: "silas",
        lastname: "bulus",
        email: "silasbulu2@gmail.com",
        password: await bcrypt.hash("Silas1510@", 10),
        role: "user",
        image: "https://via.placeholder.com/150",
      });
      console.log("👤 User created:", user.email);
    }

    let admin = await Account.findOne({ email: "bulussilas26@gmail.com" });
    if (!admin) {
      admin = await Account.create({
        firstname: "silas",
        lastname: "bulus",
        email: "bulussilas26@gmail.com",
        password: await bcrypt.hash("Bulus1510@", 10),
        role: "admin",
        image: "https://via.placeholder.com/150",
      });
      console.log("👤 Admin created:", admin.email);
    }

    const productsData = [
      {
        name: "paracetamols",
        description: "Fast-acting pain reliever and fever reducer.",
        price: 1000,
        quantity: 11,
        stock: 40,
        lowStockThreshold: 3,
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 12)),
        sku: "SKU-001",
        displayimg: "https://via.placeholder.com/300",
        shortdescription: "This is a short description",
        longdescription: "This is a longer description of the sample product.",
        category: "antibiotics",
        addedby: admin._id,
      },
      {
        name: "nFERTILAID FOR WOMEN CAPS X90",
        description: "Fast-acting pain reliever and fever reducer.",
        price: 900,
        quantity: 29,
        stock: 30,
        lowStockThreshold: 5,
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        sku: "SKU-002",
        displayimg: "https://via.placeholder.com/300",
        shortdescription: "Another short description",
        longdescription: "This is another longer description",
        category: "syrup",
        addedby: admin._id,
      },
    ];

    for (const productData of productsData) {
      const existingProduct = await Product.findOne({ sku: productData.sku });
      if (!existingProduct) {
        const newProduct = await Product.create(productData);
        console.log("📦 Product created:", newProduct.name);
      } else {
        console.log("⚠️ Product already exists:", existingProduct.name);
      }
    }

    const existingOrder = await Order.findOne({ reference: "TEST-REF-001" });
    if (!existingOrder) {
      const product1 = await Product.findOne({ sku: "SKU-001" });
      const product2 = await Product.findOne({ sku: "SKU-002" });

      const totalAmount =
        (product1?.price || 0) * 1 + (product2?.price || 0) * 2;

      const order = await Order.create({
        account: user._id,
        cart: [
          {
            product: product1._id,
            quantity: 1,
            price: product1.price,
            addedby: user._id,
          },
          {
            product: product2._id,
            quantity: 2,
            price: product2.price,
            addedby: user._id,
          },
        ],
        amount: totalAmount,
        reference: "TEST-REF-001",
        orderid: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: "pending",
        paidstatus: "unpaid",
      });

      console.log("🛒 Order created:", order._id);
    } else {
      console.log("⚠️ Order already exists:", existingOrder.reference);
    }

    console.log("✅ Seeding completed successfully (non-destructive)");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedData();
