import { Request, Response } from 'express';
import fetch from 'node-fetch';
import Channels from '../models/channel';
import Users from '../models/user';

const { AUTH_URL } = process.env;

interface ChannelApi {
  id: string;
  name: string;
}

// Login a user
const loginUser = async (req: Request, res: Response): Promise<void> => {
  fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  }).then((fetchRes: any) => fetchRes.json().then((json: any) => {
    res.status(fetchRes.status).send(json);
  }));
};

// Logout a user
const logoutUser = async (req: Request, res: Response): Promise<void> => {
  fetch(`${AUTH_URL}/logout`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${req.headers.authorization?.split(' ')[1]}`,
    },
  }).then((fetchRes: any) => fetchRes.json().then((json: any) => {
    res.status(fetchRes.status).send(json);
  }));
};

// Register a user's password
const registerUser = async (req: Request, res: Response): Promise<void> => {
  fetch(`${AUTH_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  }).then((fetchRes: any) => fetchRes.json().then((json: any) => {
    res.status(fetchRes.status).send(json);
  }));
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
// Channels to add will come as { newChannels: [{ id: , name: }] }
const addChannel = async (req: Request, res: Response): Promise<void> => {
  const userId = req.body.id;
  const { newChannels } = req.body;
  const ids = newChannels.map((newChannel: ChannelApi) => newChannel.id);
  if (!ids) {
    res.status(400).send({ message: 'You must supply a newChannels parameter' });
  }
  try {
    const channelsToAdd = await Channels.find({ _id: { $in: ids } }).exec();
    const dataForChannels = channelsToAdd.map((val) => ({ id: val._id, name: val.name }));
    const userWithChannel = await Users.findByIdAndUpdate(userId, {
      $addToSet: { channels: { $each: dataForChannels } },
    }, { new: true });
    res.status(200).json(userWithChannel);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// DELETE a channel from users list
const deleteChannelFromUserList = async (req: Request, res: Response): Promise<void> => {
  try {
    const removeChannelFromList = await Users.findByIdAndUpdate(res.locals.user._id,
      { $pull: { 'channels.$': { id: req.params.id } } },
      { new: true });
    res.status(203).json(removeChannelFromList);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// PUT add an issue to a user
const addIssue = async (req: Request, res: Response): Promise<void> => {
  const userId = req.body.id;
  const { newIssue } = req.body;
  try {
    const userWithIssue = await Users.findByIdAndUpdate(userId, {
      $addToSet: { issueMeta: { id: newIssue._id, title: newIssue.title } },
    }, { new: true });
    res.status(200).json(userWithIssue);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// PUT remove an issue from a user
const removeIssue = async (req: Request, res: Response): Promise<void> => {
  const userId = req.body.id;
  const { issueToRemove } = req.body;
  try {
    const userWithoutIssue = await Users.findByIdAndUpdate(userId, {
      $pull: { 'issueMeta.$': { id: issueToRemove._id, title: issueToRemove.title } },
    }, { new: true });
    res.status(200).json(userWithoutIssue);
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
    const upadteInfo = await Users.findByIdAndUpdate(req.params.id, { ...req.body.user }, { new: true });
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
  addIssue,
  removeIssue,
  approveUser,
  bannedUser,
  deleteUser,
  updateUserInfo,
  loginUser,
  logoutUser,
  registerUser,
};
