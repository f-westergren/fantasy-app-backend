const express = require('express');

// Import books-controller
const usersRoutes = require('./../controllers/users-controller.js');

// Create router
const router = express.Router();

router.post('/', usersRoutes.usersCreate);
router.get('/', usersRoutes.usersAll);
router.get('/:username', usersRoutes.usersOne);
router.delete('/:id', usersRoutes.usersDelete);

module.exports = router;
