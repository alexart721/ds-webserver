import express from 'express';
import issue from 'controllers/issue';
import userAuth from './middlewares/userAuth';
// import adminAuth from './middlewares/adminAuth';

const router = express.Router();

router.get('/issues/:id', userAuth, issue.getIssue);

export default router;
