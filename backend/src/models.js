import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
	_id: String,
	name: String,
	description: String,
	type: Number,
	quantity: Number,
	price: Number,
	img: String,
});

const userSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		auto: true,
	},
	fname: {
		type: String,
		required: [true, "no-user-first-name"],
	},
	mname: {
		type: String,
	},
	lname: {
		type: String,
		required: [true, "no-user-last-name"],
	},
	type: {
		type: String,
		required: [true, "no-user-type"],
	},
	email: {
		type: String,
		unique: true,
		required: [true, "no-user-email"],
	},
	password: {
		type: String,
		required: [true, "no-user-password"],
	},
	cart: [
		{
			item: String,
			quantity: Number,
		},
	],
});

const transactionSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		auto: true,
	},
	content: Array,
	status: Number,
	customer: mongoose.Schema.Types.ObjectId,
	date_ordered: Date,
	payment_method: String,
});

const User = mongoose.models.User || mongoose.model("User", userSchema, "Users");
const Product = mongoose.models.Product || mongoose.model("Product", productSchema, "Products");
const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema, "Transactions");

export default { User, Product, Transaction };
