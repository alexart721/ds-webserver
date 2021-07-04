import { Request, Response } from 'express';
import DmChannels from '../models/dmChannel';
import Messages from '../models/message';
import Users from '../models/user';

// GET all dms for a user
const getAllDmChannelForUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const getAllDmChannel = await Users.findById(res.locals.user._id);
    res.status(200).json(getAllDmChannel?.dmChannels);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// POST to create a new dm channel
const createNewDmChannel = async (req: Request, res: Response): Promise<void> => {
  try {
    const newDmChannel = await DmChannels.create(req.body.dmChannel);
    await Users.findOneAndUpdate({ _id: res.locals.user._id }, { $push: newDmChannel._id });
    res.status(201).json(newDmChannel);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// GET a specific dm channel
const getDmChannelById = async (req: Request, res: Response): Promise<void> => {
  try {
    const getDmChannel = await DmChannels.findById(req.params.id);
    res.status(200).json(getDmChannel);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// POST a message to a dm
const addNewMessage = async (req: Request, res: Response): Promise<void> => {
  const messageBody = req.body.message;
  try {
    const newMessage = await Messages.create({ messageOwner: res.locals.user._id, content: messageBody });
    const addMessageToDmChannel = await DmChannels.findOneAndUpdate({ _id: req.params.id }, { $push: newMessage._id }, { new: true });
    res.status(201).json(addMessageToDmChannel);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// DELETE a dm channel
const deleteDmChannel = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleteChannel = await DmChannels.deleteOne({ _id: req.params.id });
    await Users.findByIdAndUpdate(res.locals.user._id, { $pull: req.params.id });
    res.status(203).json(deleteChannel);
  } catch (error) {
    res.status(500).send({ error });
  }
};

export default {
  getAllDmChannelForUser, createNewDmChannel, getDmChannelById, addNewMessage, deleteDmChannel,
};
