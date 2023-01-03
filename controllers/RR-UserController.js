const userSchema = require('../schemas/RR-UserSchema');
const bcrypt = require('bcrypt');
const { uid } = require('uid');

const RRregisterUser = async (req, res) => {
  const { username, password1 } = req.body;
  const hashedPass = await bcrypt.hash(password1, 10);
  const userId = uid(20);

  const userObject = {
    username,
    password: hashedPass,
    favorites: [],
    secret: userId,
  };
  const newUser = new userSchema(userObject);
  await newUser.save();

  if (!newUser) {
    return res.status(400).json({ error: true, data: [{ message: 'Error in user registration' }] });
  }
  return res
    .status(201)
    .json({ error: false, message: 'Registration is ok', data: { user: newUser, userId: newUser.secret } });
};

const RRloginUser = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await userSchema.findOne({ username });

    const success = {
      error: false,
      message: 'Login successful',
      data: { user, userId: user.secret },
    };
    return res.status(201).json(success);
  } catch (error) {
    return res.status(400).json({ error: true, message: 'Incorrect data', data: error.details });
  }
};

const RRgetUser = async (req, res) => {
  const { secret } = req.params;
  try {
    const user = await userSchema.findOne({ secret });
    return user;
  } catch (error) {
    return res.status(400).json({ error: true, message: 'User not Found', data: error.details });
  }
};

const RRupdateUserInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userSchema.findOneAndUpdate(
      { secret: userId },
      { $push: { favorites: req.body } },
      { new: true }
    );
    console.log('user ===', user);
    return res.status(201).json({ error: false, data: { user: user, message: 'User info updated successfully' } });
  } catch (error) {
    return res.status(400).json({ error: true, message: 'User update failed', data: error.details });
  }
};
const RRremoveUserInfo = async (req, res) => {
  try {
    console.log('req.query ===', req.params);
    const { userId, mealId } = req.params;
    const user = await userSchema.findOneAndUpdate(
      { secret: userId },
      { $pull: { favorites: { mealId: mealId } } },
      { new: true }
    );

    return res.status(201).json({ error: false, data: { user: user, message: 'User info updated successfully' } });
  } catch (error) {
    return res.status(400).json({ error: true, message: 'User update failed', data: error.details });
  }
};

module.exports = {
  RRregisterUser,
  RRloginUser,
  RRgetUser,
  RRupdateUserInfo,
  RRremoveUserInfo,
};
