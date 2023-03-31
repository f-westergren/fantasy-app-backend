const express = require('express');

const scoresRoutes = require('./../controllers/scores-controller.js');

const router = express.Router();

router.get('/', scoresRoutes.scoresAll);
router.post('/', scoresRoutes.scoresCreate);
router.patch('/', scoresRoutes.scoresUpdate);
// router.get('/:username', picksRoutes.picksOne);
// router.delete('/', picksRoutes.picksReset);

module.exports = router;
