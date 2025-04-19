const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const { getMessages,deleteMessage} = require('../controllers/messageController');
const User = require('../models/Users');
const Friend = require('../models/Friend');
const FriendRequest = require('../models/FriendRequest');
const Message = require('../models/Message');

const router = express.Router();

// Render the chat page (protected route)
router.get('/chat', authenticate, async (req, res) => {
  const { receiverId } = req.query;
  if (!receiverId) {
    return res.status(400).json({ error: 'Receiver ID is required' });
  }
  try {
    console.log("Receiver ID: ", receiverId);
    // Check if the receiver is a friend
    const isFriend = await Friend.isFriend(req.userId, receiverId);
    if (!isFriend) {
      return res.status(403).json({ error: 'You can only chat with friends' });
    }

    // Fetch messages
    const messages = await getMessages(req, res);
    const lastMessages = await Message.getLastMessages(req.userId);
    const formattedLastMessages = lastMessages.map(message => ({
      ...message,
      created_at: new Date(message.created_at).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
      }),
  }));
    // Fetch receiver's username
    const receiver = await User.findByUserId(receiverId);
    const receiverUsername = receiver ? receiver.username : 'Unknown';
    // Fetch all users except the logged-in user
    const users = await User.findAllExcept(req.userId);
    const friends = await FriendRequest.getFriends(req.userId);
    const currentUser = await User.findByUserId(req.userId);
    console.log("last messages:", lastMessages);
    // Fetch pending friend requests
    const friendRequests = await FriendRequest.findByReceiverId(req.userId);

    // Render the chat template
    res.json({
      userId: req.userId,
      receiverId,
      senderId:req.userId,
      receiver,
      receiverUsername,
      messages: messages || [],
      lastMessages: formattedLastMessages || [],
      token: req.query.token,
      friends,
      users,
      currentUser,
      friendRequests, // Pass pending friend requests to the template
    });
  } catch (error) {
    console.error('Error rendering chat page:', error);
    res.status(500).json({ error: 'Error rendering chat page' });
  }
});

router.delete('/delete/:messageId', authenticate, deleteMessage);

module.exports = router;