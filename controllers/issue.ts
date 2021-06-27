import { Request, Response } from 'express';
import { ExtendedRequest } from 'interfaces';
import Messages from 'models/message';
import Issue from '../models/issue';

const getIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const issue = await Issue.findById(req.params.id).exec();
    res.status(200).send(issue);
  } catch (err) {
    res.status(400).send(err);
  }
};

const getArchivedIssues = async (req: Request, res: Response): Promise<void> => {
  try {
    const archivedIssues = await Issue.find({ status: 'Closed' }).exec();
    res.status(200).send(archivedIssues);
  } catch (err) {
    res.status(400).send(err);
  }
};

const updateIssue = async (req: Request, res: Response): Promise<void> => {
  const updates = req.body.issue;
  try {
    const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    res.status(200).send(updatedIssue);
  } catch (err) {
    res.status(400).send(err);
  }
};

const resolveIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const resolvedIssue = await Issue.findByIdAndUpdate(req.params.id, { $set: { status: 'Closed' } }, { new: true });
    res.status(200).send(resolvedIssue);
  } catch (err) {
    res.status(400).send(err);
  }
};

const addMessageToIssue = async (req: ExtendedRequest, res: Response): Promise<void> => {
  const messageBody = req.body.message;
  try {
    const newMessage = await Messages.create({ messageOwner: req.user._id, content: messageBody });
    const issueWithMessage = await Issue.findByIdAndUpdate(req.params.id, { $push: { threadMessages: newMessage._id } });
    res.status(201).send(issueWithMessage);
  } catch (err) {
    res.status(400).send(err);
  }
};

export default {
  getIssue, getArchivedIssues, updateIssue, resolveIssue, addMessageToIssue,
};
