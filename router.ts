import express from 'express';
import issue from './controllers/issue';
import channel from './controllers/channel';
import dmChannel from './controllers/dmChannel';
import user from './controllers/user';
import auth from './middlewares/auth';
import multer from 'multer';

const upload = multer({dest: 'uploads/'});

const router = express.Router();

// Issue routes
router.get('/issues/:id', auth('User'), issue.getIssue);
router.put('/issues/:id', auth('User'), issue.updateIssue);
router.put('/issues/:id/resolve', auth('User'), issue.resolveIssue);
router.put('/issues/:id/messages/send', auth('User'), issue.addMessageToIssue);
router.get('/issues/archived', auth('User'), issue.getArchivedIssues);

// Channel routes
router.get('/channels', auth('User'), channel.getAllChannels);
router.post('/channels', auth('Admin'), channel.createNewChannel); // ADMIN
router.delete('/channels/:id', auth('Admin'), channel.deleteOneChannel); // ADMIN
router.get('/channels/:id/issues', auth('User'), channel.getChannelIssues);
router.post('/channels/:id/issues', auth('User'), upload.single('image'), channel.addNewIssue);
router.put('/channels/:id/issues', auth('User'), channel.archiveIssue);

// DM Channel routes
router.get('/dm', auth('User'), dmChannel.getAllDmChannelForUser);
router.post('/dm', auth('User'), dmChannel.createNewDmChannel);
router.get('/dm/:id', auth('User'), dmChannel.getDmChannelById);
router.post('/dm/:id', auth('User'), dmChannel.addNewMessage);
router.delete('/dm/:id', auth('User'), dmChannel.deleteDmChannel);

// User routes
router.post('/users', user.createNewUser);
router.post('/users/login', user.loginUser);
router.post('/users/register', user.registerUser);
router.get('/users/logout', user.logoutUser);
router.get('/users/:id', auth('User'), user.getUserById);
router.put('/users/channels/add', auth('User'), user.addChannel);
router.put('/users/issues/add', auth('User'), user.addIssue);
router.put('/users/issues/remove', auth('User'), user.removeIssue);
router.delete('/users/channels/:id', auth('User'), user.deleteChannelFromUserList);
router.put('/users/:id/approve', auth('Admin'), user.approveUser); // ADMIN
router.put('/users/:id/deny', auth('Admin'), user.bannedUser); // ADMIN
router.put('/users/:id', auth('Admin'), user.updateUserInfo); // ADMIN
router.delete('/users/:id', auth('Admin'), user.deleteUser); // ADMIN

export default router;
