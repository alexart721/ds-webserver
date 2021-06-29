import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Channels from '../models/channel';
import Users from '../models/user';

const { SECRET_KEY, ADMIN_SECRET_KEY } = process.env;

// Login a user
const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).end('username and password are required');
  }
  const user = await Users.findOne({ email }).exec();
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(403).end('invalid username or password');
  }

  const token = jwt.sign({ _id: user._id }, SECRET_KEY as string, { expiresIn: '3h' });
  res.status(200).json({ accessToken: token });
};

// Login an admin
const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).end('username and password are required');
  }
  const user = await Users.findOne({ email, roles: 'Admin' }).exec();
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(403).end('invalid username or password');
  }
  const adminToken = jwt.sign({ _id: user._id }, ADMIN_SECRET_KEY as string, { expiresIn: '3h' });
  const token = jwt.sign({ _id: user._id, adminToken }, SECRET_KEY as string, { expiresIn: '3h' });
  res.status(200).json({ accessToken: token });
};

// Logout a user
const logoutUser = async (req: Request, res: Response): Promise<void> => {
  const { token, tokenExp } = res.locals;
  try {
    // JWT expire time is in seconds to expire time since Epoch
    // Redis setex takes expire time in seconds
    // Need to set by taking difference from now to exp in seconds
    const timeToExpire = tokenExp - Math.floor(Date.now() / 1000);
    const redisClient = req.app.locals.client;
    redisClient.setex(`blacklist_${token}`, timeToExpire, 'true');
    res.status(200).send({ message: 'Logout successful!' });
  } catch (error) {
    res.status(400).send({ error, message: 'System error, logging out.' });
  }
};

// Register a user's password
const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
  if (user?.status === 'Approved') {
    try {
      if (password === '') throw new Error();
      const hashPassword = await bcrypt.hash(password, 10);
      const updatedUser = await Users.findByIdAndUpdate(user?._id, { password: hashPassword, status: 'Registered' }, { new: true });
      if (SECRET_KEY) {
        const accessToken = jwt.sign({ _id: updatedUser?._id }, SECRET_KEY, { expiresIn: '1h' });
        res.status(201).send({ accessToken });
      } else {
        throw new Error('Unable to register user');
      }
    } catch (error) {
      res.status(400).send({ error, message: 'Could not register user' });
    }
  } else {
    res.status(400).send({ message: 'User account not yet approved' });
  }
};

// GET a user
const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const getUser = await Users.findById(req.params.id);
    res.status(200).json(getUser);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// POST create a new user
const createNewUser = async (req: Request, res: Response): Promise<void> => {
  const {
    firstName, lastName, email, license, state,
  } = req.body;
  try {
    if (firstName.trim() && lastName.trim() && email.trim() && license.trim() && state.trim()) {
      const newUser = await Users.create({
        firstName, lastName, email, license, state,
      });
      res.status(201).json(newUser);
    } else {
      res.status(400).send('Data is missing');
    }
  } catch (error) {
    res.status(500).send({ error });
  }
};

// PUT add a channel to user
const addChannel = async (req: Request, res: Response): Promise<void> => {
  try {
    const channelToAdd = await Channels.findById(req.params.id);
    const userWithChannel = await Users.findByIdAndUpdate(res.locals.user._id, {
      $push: { channels: { id: req.params.id, name: channelToAdd?.name } },
    });
    res.status(200).json(userWithChannel);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// DELETE a channel from users list
const deleteChannelFromUserList = async (req: Request, res: Response): Promise<void> => {
  try {
    const removeChannelFromList = await Users.findByIdAndUpdate(res.locals.user._id, { $pull: { 'channels.$': { id: req.params.id } } });
    res.status(203).json(removeChannelFromList);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// PUT approve a user
const approveUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await Users.findByIdAndUpdate(req.params.id, { $set: { status: 'Approved' } }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// PUT deny a user
const bannedUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await Users.findByIdAndUpdate(req.params.id, { $set: { status: 'Banned' } }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// DELETE a user
const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);
    res.status(203).json(user);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// PUT update user info
const updateUserInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const upadteInfo = await Users.findByIdAndUpdate(req.params.id, { ...req.body.user });
    res.status(200).json(upadteInfo);
  } catch (error) {
    res.status(500).send({ error });
  }
};

export default {
  getUserById,
  createNewUser,
  addChannel,
  deleteChannelFromUserList,
  approveUser,
  bannedUser,
  deleteUser,
  updateUserInfo,
  loginUser,
  loginAdmin,
  logoutUser,
  registerUser,
};
