import { Request, Response } from 'express';
import { ExtendedRequest } from 'interfaces';
import Channels from 'models/channel';
import Issues from 'models/issue';
import Users from 'models/user';

// GET all channels
export const getAllChannels = async (_: any, res: Response): Promise<void> => {
  try {
    const allChannels = await Channels.find();
    res.status(200).json(allChannels);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// GET issues for one channel find channel by :id
export const getChannelById = async (req: Request, res: Response): Promise<void> => {
  try {
    const getChannel = await Channels.findById(req.params.id);
    res.status(200).json(getChannel);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// POST an issue to the channel
export const addNewIssue = async (req: ExtendedRequest, res:Response): Promise<void> => {
  try {
    const addIssue = await Issues.create({ issueOwner: req.user._id, ...req.body.issue });
    const newIssueToChannel = await Channels.findOneAndUpdate({ _id: req.params.id },
      { $push: { issues: addIssue._id } });
    res.status(200).json({ newIssueToChannel, message: `New issue: ${addIssue.title} is created` });
  } catch (error) {
    res.status(500).send({ error });
  }
};

// POST create a new channel
export const createNewChannel = async (req: Request, res: Response): Promise<void> => {
  try {
    const newChannel = await Channels.create(req.body);
    res.status(201).json({ newChannel, message: `New channel: ${newChannel.name} is created` });
  } catch (error) {
    res.status(500).send({ error });
  }
};

// DELETE a channel
export const deleteOneChannel = async (req: ExtendedRequest, res: Response): Promise<void> => {
  try {
    const deleteChannel = await Channels.findByIdAndDelete(req.params.id);
    await Users.findByIdAndUpdate(req.user._id, { $pull: req.params.id });
    res.status(203).json({ deleteChannel, message: `Channel: ${deleteChannel?.name} is removed` });
  } catch (error) {
    res.status(500).send({ error });
  }
};
