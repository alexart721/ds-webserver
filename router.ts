import express from 'express';
import issue from './controllers/issue';
import channel from './controllers/channel';
import dmChannel from './controllers/dmChannel';
import user from './controllers/user';
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
router.get('/channels/:id/issues', userAuth, channel.getChannelIssues);
router.post('/channels/:id/issues', userAuth, channel.addNewIssue);

// DM Channel routes
router.get('/dm', userAuth, dmChannel.getAllDmChannelForUser);
router.post('/dm', userAuth, dmChannel.createNewDmChannel);
router.get('/dm/:id', userAuth, dmChannel.getDmChannelById);
router.post('/dm/:id', userAuth, dmChannel.addNewMessage);
router.delete('/dm/:id', userAuth, dmChannel.deleteDmChannel);

// User routes
router.get('/users/:id', userAuth, user.getUserById);
router.post('/users', user.createNewUser);
router.post('/users/login', userAuth, user.loginUser);
router.post('/users/register', user.registerUser);
router.post('/users/logout', userAuth, user.logoutUser);
router.put('/users/channel/:id', userAuth, user.addChannel);
router.delete('/users/channels/:id', userAuth, user.deleteChannelFromUserList);
router.put('/users/:id/approve', adminAuth, user.approveUser); // ADMIN
router.put('/users/:id/deny', adminAuth, user.bannedUser); // ADMIN
router.put('/users/:id', adminAuth, user.updateUserInfo); // ADMIN
router.delete('/users/:id', adminAuth, user.deleteUser); // ADMIN

export default router;
