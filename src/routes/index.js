const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const bookRoutes = require('./books');
const categoryRoutes = require('./categories');
const installRoute = require('./install');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/books', bookRoutes);
router.use('/categories', categoryRoutes);
router.use('/install', installRoute);

module.exports = router;
