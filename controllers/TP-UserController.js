const userSchema = require('../schemas/UserSchema');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  const { name, email, password, notes } = req.body;
  const hashedPass = await bcrypt.hash(password, 10);
  const userId = uid(20);

  const userObject = {
    name,
    email,
    password: hashedPass,
    notes,
    secret: userId,
  };
  const newUser = new userSchema(userObject);

  await newUser.save();

  if (!newUser) {
    return res.status(400).json({ error: true, data: [{ message: 'Error in user registration' }] });
  }
  return res
    .status(201)
    .json({ error: false, message: 'Registration is ok', data: { userId: newUser.secret, username } });
};

const loginUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userSchema.findOne({ email });

    const success = {
      error: false,
      message: 'Login successful',
      data: { user, userId: user.secret, email: user.email },
    };
    return res.status(201).json(success);
  } catch (error) {
    return res.status(400).json({ error: true, message: 'Incorrect data', data: error.details });
  }
};

const getUser = async (req, res) => {
  const { secret } = req.params;
  try {
    const user = await userSchema.findOne({ secret });
    return user;
  } catch (error) {
    return res.status(400).json({ error: true, message: 'User not Found', data: error.details });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
};
