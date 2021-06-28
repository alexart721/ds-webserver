import { Request, Response } from 'express';
import Users from '../models/user';

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
  try {
    const newUser = await Users.create(req.body.userInfo);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// PUT add a channel to user
const addChannel = async (req: Request, res: Response): Promise<void> => {
  try {
    const newChannel = await Users.findByIdAndUpdate(res.locals.user._id, { $push: { channels: req.params.id } });
    res.status(200).json(newChannel);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// DELETE a chhanel from users list
const deleteChannelFromUserList = async (req: Request, res: Response): Promise<void> => {
  try {
    const removeChannelFromList = await Users.findByIdAndUpdate(res.locals.user._id, { $pull: { channels: req.params.id } });
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
  getUserById, createNewUser, addChannel, deleteChannelFromUserList, approveUser, bannedUser, deleteUser, updateUserInfo,
};
