import { Request, Response } from 'express';
import Messages from '../models/message';
import Issue from '../models/issue';

const getIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const foundIssue = await Issue.findById(req.params.id).exec();
    res.status(200).json(foundIssue);
  } catch (err) {
    res.status(400).send(err);
  }
};

const getArchivedIssues = async (req: Request, res: Response): Promise<void> => {
  try {
    const archivedIssues = await Issue.find({ status: 'Closed' }).exec();
    res.status(200).json(archivedIssues);
  } catch (err) {
    res.status(400).send(err);
  }
};

const updateIssue = async (req: Request, res: Response): Promise<void> => {
  const updates = req.body.issue;
  try {
    const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    res.status(200).json(updatedIssue);
  } catch (err) {
    res.status(400).send(err);
  }
};

const resolveIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const resolvedIssue = await Issue.findByIdAndUpdate(req.params.id, { $set: { status: 'Closed' } }, { new: true });
    res.status(200).json(resolvedIssue);
  } catch (err) {
    res.status(400).send(err);
  }
};

const addMessageToIssue = async (req: Request, res: Response): Promise<void> => {
  const messageBody = req.body.message;
  try {
    const newMessage = await Messages.create({ messageOwner: res.locals.user._id, content: messageBody });
    const issueWithMessage = await Issue.findByIdAndUpdate(req.params.id, { $push: { threadMessages: newMessage } }, { new: true });
    res.status(201).json(issueWithMessage);
  } catch (err) {
    res.status(400).send(err);
  }
};

export default {
  getIssue, getArchivedIssues, updateIssue, resolveIssue, addMessageToIssue,
};
