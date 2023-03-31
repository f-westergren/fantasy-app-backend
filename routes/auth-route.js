const express = require('express');
const authRoutes = require('./../controllers/auth-controller.js');

const router = express.Router();

router.post('/login', authRoutes.authenticate);

module.exports = router;
