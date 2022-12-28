const userSchema = require('../schemas/UserSchema');
const bcrypt = require('bcrypt');
const { uid } = require('uid');

const registerUser = async (req, res) => {
  console.log('req.body ===', req.body);
  const { name, email, password1, notes, lastName, image } = req.body;
  const hashedPass = await bcrypt.hash(password1, 10);
  const userId = uid(20);

  const userObject = {
    name,
    email,
    password: hashedPass,
    notes,
    secret: userId,
    lastName,
    image,
  };
  const newUser = new userSchema(userObject);

  await newUser.save();

  if (!newUser) {
    return res.status(400).json({ error: true, data: [{ message: 'Error in user registration' }] });
  }
  return res
    .status(201)
    .json({ error: false, message: 'Registration is ok', data: { user: newUser, userId: newUser.secret, email } });
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

const updateUserInfo = async (req, res) => {
  try {
    const { secret } = req.params;
    const { name, email, lastName, image } = req.body;

    // const emailTaken = await userSchema.findOne({ email: email});
    // if (emailTaken) {
    //   return res.status(400).json({error: true, data: {message: 'this email is already taken'}})
    // }
    console.log('req.body ===', req.body);
    const user = await userSchema.findOneAndUpdate(
      { secret: secret },
      { $set: { name: name, email: email, lastName: lastName, image: image } }
    );
    console.log('user ===', user);
    return res.status(201).json({ error: false, data: { user: user, message: 'User info updated successfully' } });
  } catch (error) {
    return res.status(400).json({ error: true, message: 'User update failed', data: error.details });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUserInfo,
};
