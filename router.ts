import express from 'express';
import issue from 'controllers/issue';
import channel from 'controllers/channel';
import userAuth from './middlewares/userAuth';
import adminAuth from './middlewares/adminAuth';

const router = express.Router();

// Issue routes
router.get('/issues/:id', userAuth, issue.getIssue);
router.put('/issues/:id', userAuth, issue.updateIssue);
router.put('/issues/:id/resolve', userAuth, issue.resolveIssue);
router.put('/issues/:id/messages/send', userAuth, issue.addMessageToIssue);
router.get('/issues/archived', userAuth, issue.getArchivedIssues);

// Channel routes
router.get('/channels', userAuth, channel.getAllChannels);
router.post('/channels', adminAuth, channel.createNewChannel); // ADMIN
router.delete('/channels/:id', adminAuth, channel.deleteOneChannel); // ADMIN
// router.get('/channels/:id/issues', userAuth, ) this needs to be get all issues on a channel
router.post('/channels/:id/issues', userAuth, channel.addNewIssue);

export default router;
