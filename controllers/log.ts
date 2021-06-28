import { Request, Response } from 'express';
import Logs from '../models/log';

// GET all logs
const getAllLogs = async (_: Request, res: Response): Promise<void> => {
  try {
    const getLogs = await Logs.find();
    res.status(200).json(getLogs);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// POST create a Log
const createLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const newLog = await Logs.create(req.body.logs);
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// POST create a bulk Log
const createBulkLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const bulkLog = await Logs.insertMany(req.body.logs);
    res.status(201).json(bulkLog);
  } catch (error) {
    res.status(500).send({ error });
  }
};

export default {
  getAllLogs, createLog, createBulkLog,
};
