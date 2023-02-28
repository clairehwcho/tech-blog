const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Get all posts
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'comment',
                        'date_created',
                        'post_id',
                        'user_id'
                    ],
                    include: {
                        model: User,
                        attribute: ['username']
                    }
                }
            ],
        });

        const posts = postData.map((post) => post.get({ plain: true }));

        res.render('homepage', {
            posts,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get one post
router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'comment',
                        'date_created',
                        'post_id',
                        'user_id'
                    ],
                    include: {
                        model: User,
                        attribute: ['username']
                    }
                }
            ],
        });

        const post = postData.get({ plain: true });

        res.render('one-post', {
            ...post,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all posts created by user
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Post }],
        });

        const user = userData.get({ plain: true });

        res.render('dashboard', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Render a form to create a new post
router.get('/dashboard/new', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Post }],
        });

        const user = userData.get({ plain: true });

        res.render('new-post', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Render a form to edit or delete a post
router.get('/dashboard/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'comment',
                        'date_created',
                        'post_id',
                        'user_id'
                    ],
                    include: {
                        model: User,
                        attribute: ['username']
                    }
                }
            ],
        });

        const post = postData.get({ plain: true });

        res.render('edit-post', {
            ...post,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Render login page if not logged-in
router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }

    res.render('login');
});

// Render signup page if not logged-in
router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }

    res.render('signup');
});

module.exports = router;
