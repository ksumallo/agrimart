// import { run } from './atlas.js'
import mongoose, { connect, get } from "mongoose";
import { connectDB } from "./database/db.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import models from "./models.js";

const getUserBasedOnToken = async (req, res) => {
  const token = req.cookies.jwt;
  // console.log("getUser: ", token);
  if (token) {  
    try {
      // FIXME change JWTSECRET to variable
      const decoded = await jwt.verify(token, "JWTSECRET");
      // console.log(decoded.id);
      const user = await models.User.findById(decoded.id).select("-password");
      return user.id
    } catch (error) {
      console.error(error);
      return;
    }
  } else {
    return;
  }
}

// const generateToken = () => {
//    req.cookie("jwt", token, {
//     httpOnly: true,
//     secure: false,
//     sameSite: "strict",
//     maxAge: 1 * 24 * 60 * 60 * 1000,
//   })
//   console.log(getUserBasedOnToken(req, null))
// }

// console.log(getUserBasedOnToken(generateToken(), {}))

connectDB();

// run().catch(console.dir);

const getProducts = async (req, res) => {
  try {
    const response = await models.Product.find({});

    console.log("MongoDB: Successfully sent all Products");

    res.json(response);
  } catch (e) {
    const errorMessage = "MongoDB: failed to retrieved Products";

    console.log(errorMessage, e);

    res.status(500).send(errorMessage);
  }
};

const getUsers = async (req, res) => {
  try {
    const response = await models.User.find({});

    console.log("MongoDB: Successfully retrieved all Users");

    res.send(response);
  } catch (e) {
    const errorMessage = "MongoDB: failed to retrieved all Users";

    console.log(errorMessage, e);

    res.status(500).send(errorMessage);
  }
};

const getUser = async (req, res) => {
  try {
    const userId = await getUserBasedOnToken(req, res)
    const response = await models.User.findOne({ _id: userId }, { password: 0 });

    console.log("MongoDB: Successfully retrieved one user");

    res.send(response);
  } catch (e) {
    const errorMessage = "MongoDB: failed to retrieved all Users";

    console.log(errorMessage, e);

    res.status(500).send(errorMessage);
  }
};

const addUser = async (req, res) => {
  try {
    const newUser = await models.User.create({
      fname: "Yosef",
      mname: "Mercene",
      lname: "Cuenca",
      type: "Customer",
      email: "ycmcuenca@gmail.com",
      password: "ilove100",
    });

    const response = await newUser.save();

    console.log(response);

    res.send(response);
  } catch (e) {
    res.status(400).send(e);
  }
};

const getCart = async (req, res) => {
  try {
    const userId = await getUserBasedOnToken(req, res)

    const products = await models.Product.find({}).lean().exec();
    const cartItems = await models.User.findOne(
      { _id: userId }
      //   { cart: 1 }
    );
    const cart = cartItems.cart.map((item) => {
      return {
        item: products.find((product) => product._id == item.item),
        quantity: item.quantity,
      };
    });

    res.json(cart);
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "MongoDB: Failed to retrieve cart" });
  }
};

const addProduct = async (req, res) => {
  const { name, description, type, price, img } = req.body;

  if (!(name && description && type && price && img)) {
    res.status(500).json({message: "Missing fields"})
    return
  }

  try {
    const products = new models.Product({
      _id: uuidv4(),
      name: name,
      description: description,
      type: type,
      quantity: 1,
      price: price,
      img: img,
    });

    const response = await products.save();

    console.log("MongoDB: Successfully created Product", products);

    res.send(response);
  } catch (e) {
    console.log("MongoDB: failed to create Product", e);

    res.status(500).send("MongoDB: failed to create Product");
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = await getUserBasedOnToken(req, res)
    const user = await models.User.findOne({ _id: userId });

    if (user.type == "admin") {
      const transactions = await models.Transaction.find({});
      console.log("MongoDB: Successfully retrieved transactions");
      res.send(transactions);
    } else {
      const transactions = await models.Transaction.find({customer: userId});
      console.log("MongoDB: Successfully retrieved transactions");
      res.send(transactions);
    }
  } catch (e) {
    res.status(500).send("MongoDB: Failed to retrieve transactions");
  }
};

const addTransaction = async (req, res) => {
  try {
    const userId = await getUserBasedOnToken(req, res)

    console.log('TransactionUserId: ', userId)

    const userObj = await models.User.findOne(
      { _id: userId },
    ).lean().exec();

    console.log('TransactionCart: ', userObj.cart)

    if (userObj.cart) {
      const transaction = new models.Transaction({
        content: userObj.cart,
        status: 0,
        customer: userId,
        date_ordered: Date.now(),
        payment_method: "GCash",
      });

      // Insert document into Transaction collection
      console.log('Transaction: ', transaction)
      
      await models.Transaction.create(transaction);
      await models.User.findOneAndUpdate({ _id: userId }, { cart: []});

      await Promise.all(
        transaction.content.map(async (item) => {
          // console.log(item.item);
          const product = await models.Product.findOneAndUpdate({_id: item.item }, { $inc: {quantity: -item.quantity}});
          console.log('IsDecresed: ', product);
        })
      )
      
      res.send({ message: "MongoDB: Successfully logged new Transaction" });
    } else {
      res.send({ message: "MongoDB: Failed to find user" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("MongoDB: failed to log transaction");
  }
};

const changeStatus = async (req, res) => {
  try {
    const transaction = await models.Transaction.findOneAndUpdate(
      { _id: req.query.tId },
      { status: req.query.status },
      {new: true}
    );

    if (transaction.status == 2) {
      await Promise.all(
        transaction.content.map(async (item) => {
          // console.log(item.item);
          const product = await models.Product.findOneAndUpdate({_id: item.item }, { $inc: {quantity: item.quantity}});
          console.log('IsDecresed: ', product);
        })
      )
    }

    

    res.send({ message: "MongoDB: Successfully changed transaction status" });
  } catch (e) {
    console.error(e);
    res.status(500).send("MongoDB: Failed to change transaction status");
  }
};

const updateProduct = async (req, res) => {
  try {
    console.log(req.body)
    const response = await models.Product.findOneAndUpdate(
      { _id: req.body._id },
      req.body, { new: true }
    );

    console.log(response)

    res.send({ message: 'Successfully updated product' });
  } catch (e) {
    console.error(e);

    res.status(500).send("MongoDB: Failed to update product");
  }
};

const deleteProduct = async (req, res) => {
  try {
    // console.log('DeletingId:', req.query.productId);
    const response = await models.Product.findOneAndDelete(
      { _id: req.query.productId }
    );

    res.send({ message: 'Successfully deleted product' });
  } catch (e) {
    console.error(e);
    res.status(500).send("MongoDB: Failed to delete product");
  }
};

// Add to Cart
const addItem = async (req, res) => {
  try {
    const userId = await getUserBasedOnToken(req, res)
    const item = await models.User.findOne({
      _id: userId,
      "cart.item": req.query.productId,
    });

    console.log("QueryResult: ", item);

    if (!item) {
      const product = await models.Product.findOne({
        _id: req.query.productId,
      });

      console.log("Found product: ", product._id);
      const newDoc = await models.User.findOneAndUpdate(
        { _id: userId },
        { $push: { cart: { item: product._id, quantity: 1 } } },
        { new: true }
      );

      console.log("NewDoc: ", newDoc);

      res.status(200).send();
    } else {
      const newDoc = await models.User.findOneAndUpdate(
        { _id: userId, "cart.item": req.query.productId },
        { $inc: { "cart.$.quantity": 1 } }
      );

      console.log("AddItem: ", newDoc);

      res.send(newDoc.cart);
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

// Reduce item quantity in cart
const reduceItem = async (req, res) => {
  try {
    const userId = await getUserBasedOnToken(req, res)
    await models.User.findOneAndUpdate(
      { _id: userId, "cart.id": req.query.productId },
      { $inc: { "cart.$.quantity": -1 } }
    );

    // Remove items that have quantity=0
    const response = await models.User.findOneAndUpdate(
      { _id: userId, "cart.id": req.query.productId },
      { $pull: { cart: { quantity: { $lte: 0 } } } }
    );

    res.send(response);
  } catch (e) {
    res.status(500).send(e);
  }
};

// Remove item from cart
const removeItem = async (req, res) => {
  try {
    const userId = await getUserBasedOnToken(req, res)
    const updatedUser = await models.User.findOneAndUpdate(
      { _id: userId, "cart.item": req.query.productId },
      { $pull: { cart: { item: req.query.productId } } },
      { new: true, projection: { cart: 1, _id: 0 } }
    );

    if (!updatedUser) {
      res.status(404).send({ message: "User or item not found" });
      return;
    }

    console.log("updatedUser: ", updatedUser.cart);
    res.send(updatedUser.cart);
  } catch (e) {
    console.log("Failed to removed item from user");
    res.send(e);
  }

  	const updateProduct = async (req, res) => {
		try {
			console.log(req.body);
			const response = await models.Product.findOneAndUpdate(
			{ _id: req.body._id },
			req.body,
			{ new: true }
			);

			console.log(response);

			res.send({ message: "Successfully updated product" });
		} catch (e) {
			console.error(e);

			res.status(500).send("MongoDB: Failed to update product");
		}
	};
  
};

const annualTransaction = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const annualstartDate = new Date(currentYear, 0, 1);
    const annualendDate = new Date(currentYear, 11, 31, 23, 59, 59);
    const monthlyStartDate = new Date(currentYear, 0, 1);
    const monthlyendDate = new Date(currentYear, 11, 31, 23, 59, 59);
    const weeklyStartDate = new Date();
    weeklyStartDate.setDate(weeklyStartDate.getDate() - 7);
    const weeklyendDate = new Date();

    const annualtransactions = await models.Transaction.find({
      date_ordered: { $gte: annualstartDate, $lte: annualendDate },
    });
    const monthlytransactions = await models.Transaction.find({
      date_ordered: { $gte: monthlyStartDate, $lte: monthlyendDate },
    });
    const weeklytransactions = await models.Transaction.find({
      date_ordered: { $gte: weeklyStartDate, $lte: weeklyendDate },
    });

    var annualSum = 0;
    await Promise.all(
      annualtransactions.map(async (transaction) => {
        console.log("_____ _____ ______ ______");
        await Promise.all(
          transaction.content.map(async (item) => {
            console.log(item._id);
            const product = await models.Product.findById(item.item);
            console.log(product.price, "X", item.quantity);
            annualSum = annualSum + product.price * item.quantity;
          })
        );
      })
    );

    var monthlySum = 0;
    await Promise.all(
      monthlytransactions.map(async (transaction) => {
        console.log("_____ _____ ______ ______");
        await Promise.all(
          transaction.content.map(async (item) => {
            console.log(item._id);
            const product = await models.Product.findById(item.item);
            console.log(product.price, "X", item.quantity);
            monthlySum = monthlySum + product.price * item.quantity;
          })
        );
      })
    );

    var weekSum = 0;
    await Promise.all(
      weeklytransactions.map(async (transaction) => {
        console.log("_____ _____ ______ ______");
        await Promise.all(
          transaction.content.map(async (item) => {
            console.log(item._id);
            const product = await models.Product.findById(item.item);
            console.log(product.price, "X", item.quantity);
            weekSum = weekSum + product.price * item.quantity;
          })
        );
      })
    );

    res
      .status(200)
      .json({ annual: annualSum, monthly: monthlySum, week: weekSum });
  } catch (e) {
    console.error(e);
    res.status(500).send("MongoDB: Failed to retrieve annual transactions");
  }
};


export const Product = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
};

export const Cart = {
  getCart,
  addItem,
  reduceItem,
  removeItem,
};

export const Transaction = {
  addTransaction,
  changeStatus,
  getTransactions,
  annualTransaction
};

export const User = {
  getUsers,
  addUser,
};
