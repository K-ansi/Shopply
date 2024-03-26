const User = require('../models/user.model');
const List = require('../models/list.model');
const Item = require('../models/item.model');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const session = require('express-session');

router.post('/sign-up', async (req, res) => {
  const { name, email, username, password } = req.body;

  // Check if the email is already in use
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  // Check if the username is already in use
  const existingUserByUsername = await User.findOne({ username });
  if (existingUserByUsername) {
    return res.status(400).json({ message: 'Username already in use' });
  }

  // Create a new user if the email is not in use
  const user = new User({
    name,
    email,
    username,
    password
  });

  // Authentication successful, create a session for the user
    req.session.user = {
      name: name,
      username: username,
      email: email
    };

  try {
    const newUser = await user.save();
    res.status(201).json({ message: 'SignUp successful', user: req.session.user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Authentication successful, create a session for the user
    req.session.user = {
      name: user.name,
      username: user.username,
      email: user.email
    };

    res.status(200).json({ message: 'Login successful', user: req.session.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});

router.get('/check-auth', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ authenticated: true, user: req.session.user });
  } else {
    res.status(200).json({ authenticated: false });
  }
});

router.get('/my-lists', async (req, res) => {
  try {
    const username = req.session.user.username;
    const lists = await List.find({ members: username });
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/create-list', async (req, res) => {
  try {
    const { name } = req.body;
    const owner = req.session.user.username;

    const newList = new List({
      name,
      owner,
      members: [owner],
      items: []
    });

    const createdList = await newList.save();
    res.status(201).json(createdList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/items', async (req, res) => {
  const { q } = req.query;
  try {
    const items = await Item.find({ name: { $regex: q, $options: 'i' } }).limit(10);
    res.json(items);
  } catch (error) {
    console.error('Error searching items:', error);
    res.status(500).json({ error: 'An error occurred while searching items.' });
  }
});

router.post('/add-item', async (req, res) => {

  const { item, amount, listId } = req.body;

  user = req.session.user.username

  console.log(listId)

  try {
    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    const existingItem = list.items.find(
      (i) => i.item.toString() === item && i.user === user
    );

    if (existingItem) {
      existingItem.amount += amount;
    } else {
      list.items.push({ item, amount, user });
    }

    await list.save();

    res.status(200).json({ message: 'Item added successfully' });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'An error occurred while adding the item' });
  }
});

router.post('/list-items', async (req, res) => {
  const { listId } = req.body;

  try {
    const list = await List.findById(listId).populate('items.item');

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    res.status(200).json({ list });
  } catch (error) {
    console.error('Error fetching list details:', error);
    res.status(500).json({ error: 'An error occurred while fetching the list details' });
  }
});

router.post('/create-item', async (req, res) => {
  const { name, store, price } = req.body;

  try {
    const newItem = new Item({
      name,
      store,
      price
    });

    const createdItem = await newItem.save();
    res.status(201).json(createdItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'An error occurred while creating the item' });
  }
});

module.exports = router;