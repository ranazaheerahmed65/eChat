const express = require('express');
const FriendRequest = require('../models/FriendRequest');
const Friend = require('../models/Friend');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Send a friend request
router.post('/send-request', authenticate, async (req, res) => {
    const { receiverId } = req.body;
    const senderId = req.userId;
  
  
    try {
      await FriendRequest.create(senderId, receiverId);
      res.json({ message: `Friend request is sent to ${receiverId} successfully !`});
    } catch (error) {
      console.error('Error sending friend request:', error);
      res.status(500).json({ error: 'Error sending friend request' });
    }
  });
  
  

// Accept a friend request
router.post('/accept-request', authenticate, async (req, res) => {
    const { requestId } = req.body;
    try {
      // Ensure requestId is provided
      if (!requestId) {
        console.error('Request ID is missing');
        return res.status(400).json({ error: 'Request ID is required' });
      }
  
      // Update friend request status
      await FriendRequest.acceptRequest(requestId);

      // Fetch updated friend request details
      const request = await FriendRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({ error: 'Friend request not found' });
      }
  
      // Ensure sender and receiver exist
      if (!request.sender_id || !request.receiver_id) {
        return res.status(500).json({ error: 'Invalid friend request data' });
      }
  
      // Add the users as friends (bidirectional)
      await Friend.create(request.sender_id, request.receiver_id);
      await Friend.create(request.receiver_id, request.sender_id);
  
      res.json({ message: `Friend request is accepted successfully.`});
    } catch (error) {
      console.error('Error accepting friend request:', error);
      res.status(500).json({ error: 'Error accepting friend request' });
    }
  });
  

// Reject a friend request
router.post('/reject-request', authenticate, async (req, res) => {
  const { requestId } = req.body;
  try {
    await FriendRequest.rejectRequest(requestId);
    res.json({ message: `Friend request is rejected successfully.`});
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    res.status(500).json({ error: 'Error rejecting friend request' });
  }
});

module.exports = router;
