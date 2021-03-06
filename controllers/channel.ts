import { Request, Response } from 'express';
import fs from 'fs';
import Channels from '../models/channel';
import Issues from '../models/issue';
import Users from '../models/user';
import s3 from '../s3';

// GET all channels
const getAllChannels = async (_: any, res: Response): Promise<void> => {
  try {
    const allChannels = await Channels.find();
    res.status(200).json(allChannels);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// GET issues for one channel find channel by :id
const getChannelIssues = async (req: Request, res: Response): Promise<void> => {
  try {
    const getChannel = await Channels.findById(req.params.id);
    if (getChannel) res.status(200).json(getChannel.issues);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// POST an issue to the channel
const addNewIssue = async (req: Request, res:Response): Promise<void> => {
  console.log(req.file);
  console.log(req.body);
  console.log(req.files);
  try {
    let upload;
    if (req.file) {
      upload = await s3.uploadFile(req.file);
      console.log(`Saved to [/images/${upload.Key}]`);
    }
    const user = await Users.findById(res.locals.user._id);
    const channel = await Channels.findById(req.params.id);
    const data = {
      issueOwner: res.locals.user._id,
      issueOwnerName: `Dr. ${user?.firstName} ${user?.lastName}`,
      issueChannelName: channel?.name,
      title: req.body.title,
      priority: req.body.priority,
      patientAge: req.body.patientAge,
      patientGender: req.body.patientGender,
      patientMedicalIssues: req.body.patientMedicalIssues,
      patientMedications: req.body.patientMedications,
      patientVitals: {
        temperature: req.body.temperature,
        heartRate: req.body.heartRate,
        bloodPressure: req.body.bloodPressure,
      },
      imageUrl: '',
      issueDescription: req.body.issueDescription || '',
    };
    if (upload) {
      data.imageUrl = `/images/${upload.Key}`;
    }
    const addIssue = await Issues.create(data);
    await Channels.findOneAndUpdate({ _id: req.params.id },
      { $push: { issues: addIssue } }, { new: true });
    await Users.findByIdAndUpdate(res.locals.user._id,
      { $push: { issueMeta: { id: addIssue._id, title: addIssue.title, channelName: channel?.name } } });
    res.status(200).json(addIssue);
  } catch (error) {
    res.status(500).send({ error });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};

// POST an issue to the channel
const archiveIssue = async (req: Request, res:Response): Promise<void> => {
  try {
    const { archivedIssue } = req.body;
    await Channels.findOneAndUpdate({ _id: req.params.id },
      { $pull: { 'issues.$': archivedIssue } }, { new: true });
    const updatedChannel = await Channels.findByIdAndUpdate(req.params.id,
      { $push: { archivedIssues: archivedIssue } });
    res.status(200).json(updatedChannel);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// POST create a new channel
const createNewChannel = async (req: Request, res: Response): Promise<void> => {
  try {
    const newChannel = await Channels.create(req.body);
    res.status(201).json({ newChannel, message: `New channel: ${newChannel.name} is created` });
  } catch (error) {
    res.status(500).send({ error });
  }
};

// DELETE a channel
const deleteOneChannel = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleteChannel = await Channels.findByIdAndDelete(req.params.id);
    await Users.findByIdAndUpdate(res.locals.user._id, { $pull: req.params.id });
    res.status(203).json({ deleteChannel, message: `Channel: ${deleteChannel?.name} is removed` });
  } catch (error) {
    res.status(500).send({ error });
  }
};

export default {
  getAllChannels, getChannelIssues, addNewIssue, archiveIssue, createNewChannel, deleteOneChannel,
};
