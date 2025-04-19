const express = require('express');
const User = require('../models/Users');
const authenticate = require('../middleware/authMiddleware');
const upload = require('../middleware/multer'); // Import the multer setup
const FriendRequest = require('../models/FriendRequest');
const Message = require('../models/Message');
const router = express.Router();

// Search users by username
router.get('/search', authenticate, async (req, res) => {
  const { username } = req.query;

  if (!username) {
    console.log("No username provided for search");
    return res.status(400).json({ error: 'Username is required for search' });
  }

  try {
    let users = await User.findAllExceptFriends(req.userId);
    users = users.filter(user => user.username.toLowerCase().includes(username.toLowerCase()));
    
    if (users.length === 0) {
      console.log("No users found matching:", username);
    } else {
      console.log("Users found:", users);
    }

    res.json({ users }); // Return JSON instead of rendering a view
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Error searching users' });
  }
});


  router.get('/select-receiver', authenticate, async (req, res) => {
    try {
      console.log('UserId:', req.userId);
      // Fetch users excluding the logged-in user
      const users = await User.findAllExcept(req.userId);
      const currentUser = await User.findByUserId(req.userId);
  
      // Fetch friend requests for the logged-in user
      const friendRequests = await FriendRequest.findByReceiverId(req.userId);
      // Fetch friends of the logged-in user
      const friends = await FriendRequest.getFriends(req.userId);
      const lastMessages = await Message.getLastMessages(req.userId);
      const formattedLastMessages = lastMessages.map(message => ({
        ...message,
        created_at: new Date(message.created_at).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }),
    }));
      console.log('last messages:', lastMessages);
      console.log('token:', req.query.token);
      // Render select-user page
      res.json({ 
        users, 
        currentUser,
        friendRequests, 
        friends,
        lastMessages: formattedLastMessages,
        userId:req.userId,
        token: req.query.token
      });
  
    } catch (error) {
      console.error('Error fetching select-user data:', error);
      res.status(500).json({ error: 'Error loading select-user page' });
    }
  });

  router.get('/profile',authenticate,async (req, res) => {
        try {
          const currentUser = await User.findByUserId(req.userId);
          const friends = await FriendRequest.getFriends(req.userId);
          const friendRequests = await FriendRequest.findByReceiverId(req.userId);
          const users = await User.findAllExcept(req.userId);
          const lastMessages = await Message.getLastMessages(req.userId);
          const formattedLastMessages = lastMessages.map(message => ({
            ...message,
            created_at: new Date(message.created_at).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            }),
        }));
          res.json({
            currentUser,
            friends,
            friendRequests,
            users,
            lastMessages:formattedLastMessages,
            token: req.query.token,
            userId:req.userId
          })
        } catch (error) {
          console.error("error fetching user data :", error);
          res.status(500).json({error: "Error loading user profile page"})
        }
  });

  router.get('/edit-about/:userId', authenticate, async (req, res) =>{
    try{
      const { userId } = req.params;
      const currentUser = await User.findByUserId(userId);
      res.json({currentUser,userId,token:req.query.token});
    } catch (error) {
      console.error("error fetching user data :", error);
      res.status(500).json({error: "Error loading user about page"})
    }
  });
  
  router.post('/update-about/:userId',authenticate, async (req, res) => {
    try {
        const { userId } = req.params;
        const { newAbout,token } = req.body;
        await User.updateAbout(userId, newAbout);
        res.json({message : "user is updated successfully."});
    } catch (error) {
        console.error("Error updating user about:", error);
        res.status(500).json({ error: "Error updating user about" });
    }
});

router.get('/edit-name/:userId', authenticate, async (req, res) =>{
  try{
    const { userId } = req.params;
    const currentUser = await User.findByUserId(userId);
    res.json({currentUser,userId,token:req.query.token});
  } catch (error) {
    console.error("error fetching user data :", error);
    res.status(500).json({error: "Error loading user about page"})
  }
});

router.post('/update-name/:userId',authenticate, async (req, res) => {
  try {
      const { userId } = req.params;
      const { newUsername,token } = req.body;
      await User.updateName(userId, newUsername);
      res.json("usename is updated successfully.");
  } catch (error) {
      console.error("Error updating user about:", error);
      res.status(500).json({ error: "Error updating user about" });
  }
});

router.post('/update-avatar/:userId', upload.single('avatar'), authenticate, async (req, res) => {
  try {
      console.log("File uploaded:", req.file); // Check if file is received
      console.log("Request body:", req.body); // Check other form data

      const { userId } = req.params;
      const avatarPath = req.file ? `avatars/${req.file.filename}` : 'avatars/default.png';

      await User.updateAvatar(userId, avatarPath);

      res.json({ success: true, message: "Avatar updated successfully", avatarPath });
  } catch (error) {
      console.error("Error updating avatar:", error);
      res.status(500).json({ error: "Error updating avatar" });
  }
});





module.exports = router;