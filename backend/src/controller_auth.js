import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import User from './models.js';

const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body)

  const { fname, mname, lname, type, email, password } = req.body;

  if (!fname || !lname || !type || !email || !password) {
    res.status(400);
    throw new Error('fields-incomplete');
  }

  // check if email used
  if (await User.findOne({ email: email })) {
    res.status(400);
    throw new Error('email-used');
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await User.create({
    fname: fname,
    mname: mname ? mname : undefined,
    lname: lname,
    type: type,
    email: email,
    password: hashedPassword
  });

  // check if user is created in database
  if (user) {
    res.status(201).json({
      _id: user._id,
      fname: user.fname,
      mname: user.mname,
      lname: user.lname,
      type: user.type,
      email: user.email,
      token: generateToken(user._id)
    });
  }
  else {
    res.status(400);
    throw new Error('invalid-user-credentials');
  }
}, 'Users')

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if email exists
  const user = await User.findOne({ email: email });

  console.log(user);

  // check if user exists and password is correct
  if (user && await bcrypt.compare(password, user.password)) {
    res.status(200).json({
      _id: user._id,
      token: generateToken(user._id)
    })
  }

})

function generateToken(id) {
  const token = jwt.sign({ id }, "JWTSECRET", { expiresIn: '1d' });
  return token;
}

export { registerUser, loginUser };