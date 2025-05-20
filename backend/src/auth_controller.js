import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import models from "./models.js";
import validator from "validator";

const { User } = models;

const auth_register = expressAsyncHandler(async (req, res) => {
  // extract contents into single variables
  const { firstName, middleName, lastName, type, email, password } = req.body;

  // check for missing fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    firstName.trim() === "" ||
    lastName.trim() === "" ||
    email.trim() === "" ||
    password.trim() === ""
  ) {
    res.status(400).json({ message: "missing-fields-encountered" });
    console.error("missing-fields");
  }

  // check if email is valid
  if (!validator.isEmail(email)) {
    res.status(400).json({ message: "invalid-email" });
  }

  if (await User.findOne({ email: email })) {
    res.status(400).json({ message: "email-already-in-use" });
    console.error("email-in-use");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await User.create({
    fname: firstName,
    mname: !middleName || middleName.trim() == "" ? null : middleName,
    lname: lastName,
    type: type ? type : "user",
    email: email,
    password: hashedPassword,
  });

  generateToken(res, user.id);

  if (user) {
    res.status(200).json({ message: "registration-success" });
  } else {
    res.status(500).json({ message: "registration-failed" });
  }
});

const auth_updateUser = expressAsyncHandler(async (req, res) => {
  // note the user id
  const userId = req.user.id;

  // extract contents into single variables
  const { firstName, middleName, lastName, type, email, password } = req.body;

  // check for missing fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    firstName.trim() === "" ||
    lastName.trim() === "" ||
    email.trim() === "" ||
    password.trim() === ""
  ) {
    res.status(400).json({ message: "missing-fields-encountered" });
    console.error("missing-fields");
  }

  // check if email is valid
  if (!validator.isEmail(email)) {
    res.status(400).json({ message: "invalid-email" });
  }

  if (await User.findOne({ email: email })) {
    res.status(400).json({ message: "email-already-in-use" });
    console.error("email-in-use");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await User.findByIdAndUpdate(userId, {
    fname: firstName,
    mname: !middleName || middleName.trim() == "" ? null : middleName,
    lname: lastName,
    type: type ? type : "user",
    email: email,
    password: hashedPassword,
  });

  if (user) {
    res.status(200).json({ message: "update-success" });
  } else {
    res.status(500).json({ message: "update-failed" });
  }
});

// authenticate user
const auth_user = expressAsyncHandler(async (req, res) => {
  // check request body
  const { email, password } = req.body;

  // check for missing fields
  if (!(email && password)) {
    res.status(400).json({ message: "missing-fields" });
  }

  // check user in database
  const user = await User.findOne({ email: email });

  if (user && (await bcrypt.compare(password, user.password))) {
    generateToken(res, user.id);
    res
      .status(200)
      .json({ message: "login-successful", userId: user._id, type: user.type });
  } else {
    res.status(401).json({ message: "invalid-credentials" });
  }
});

// logout user
// FIXME make secure TRUE when in PRODUCTION
const auth_logout = expressAsyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    maxAge: -1, // expire immediately
  });
  res.status(200).json({ message: "log-out-succesful" });
});

const auth_protect = expressAsyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  // console.log("PROTECT: ", token);
  if (token) {
    try {
      // FIXME change JWTSECRET to variable
      const decoded = await jwt.verify(token, "JWTSECRET");
      // console.log(decoded.id);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "not-authorized-invalid-token" });
    }
  } else {
    res.status(401).json({ message: "not-authorized-no-token" });
  }
});

const auth_adminOnly = expressAsyncHandler(async (req, res, next) => {
  if (req.user.type == "admin") {
    next();
  } else {
    res.status(401).json({ message: "admin-privileges-required" });
  }
});

const auth_getUser = expressAsyncHandler(async (req, res) => {
  const token = req.cookies.jwt;
  console.log(token);
  if (token) {
    try {
      // FIXME change JWTSECRET to variable
      const decoded = await jwt.verify(token, "JWTSECRET");
      const user = await User.findById(decoded.id).select("-password");
      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "not-authorized-invalid-token" });
    }
  } else {
    res.status(401).json({ message: "not-authorized-no-token" });
  }
});

// FIXME change JWTSECRET to a constant variable import
function generateToken(res, id) {
  const token = jwt.sign({ id }, "JWTSECRET", { expiresIn: "1d" });
  // FIXME make secure TRUE when in PRODUCTION
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
}

export {
  auth_register,
  auth_user,
  auth_logout,
  auth_protect,
  auth_adminOnly,
  auth_getUser,
  auth_updateUser,
};
