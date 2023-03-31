const express = require('express');

// Import books-controller
const picksRoutes = require('./../controllers/picks-controller.js');

// Create router
const router = express.Router();

router.get('/', picksRoutes.picksAll);
router.post('/', picksRoutes.picksCreate);
router.patch('/', picksRoutes.picksUpdate);
router.get('/:username', picksRoutes.picksOne);
router.delete('/', picksRoutes.picksReset);

module.exports = router;
