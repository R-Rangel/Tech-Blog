const router = require('express').Router();
const { Post, Comment, User } = require('../models');

// GET all posts associated with the current user
router.get('/', async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.userId, {
      include: [{ model: Post, include: [Comment] }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', { user, loggedIn: req.session.loggedIn });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET the page to create a new post
router.get('/new-post', (req, res) => {
  res.render('new-post', { loggedIn: req.session.loggedIn });
});

// GET the page to edit an existing post
router.get('/edit-post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id);

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    const post = postData.get({ plain: true });

    res.render('edit-post', { post, loggedIn: req.session.loggedIn });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
