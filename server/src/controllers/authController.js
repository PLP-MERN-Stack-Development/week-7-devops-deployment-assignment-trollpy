const User = require('../models/User');
const logger = require('../config/logger');

const syncUser = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { emailAddress, firstName, lastName } = req.body;

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = new User({
        clerkId: userId,
        email: emailAddress,
        firstName,
        lastName,
        lastLogin: new Date()
      });
    } else {
      user.email = emailAddress;
      user.firstName = firstName;
      user.lastName = lastName;
      user.lastLogin = new Date();
    }

    await user.save();
    res.json({ user });
  } catch (error) {
    logger.error('Error syncing user:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    logger.error('Error getting profile:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.auth;
    const updates = req.body;

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: updates },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    logger.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

const connectGithub = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { githubToken } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: { githubToken } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'GitHub account connected successfully' });
  } catch (error) {
    logger.error('Error connecting GitHub:', error);
    res.status(500).json({ error: 'Failed to connect GitHub account' });
  }
};

const disconnectGithub = async (req, res) => {
  try {
    const { userId } = req.auth;

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $unset: { githubToken: 1 } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'GitHub account disconnected successfully' });
  } catch (error) {
    logger.error('Error disconnecting GitHub:', error);
    res.status(500).json({ error: 'Failed to disconnect GitHub account' });
  }
};

module.exports = {
  syncUser,
  getProfile,
  updateProfile,
  connectGithub,
  disconnectGithub
};