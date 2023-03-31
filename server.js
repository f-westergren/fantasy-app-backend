// Import dependencies
require('dotenv').config();
const express = require('express');
const path = require('path');

const cors = require('cors');
const helmet = require('helmet');

// Logging system
const morgan = require('morgan');

// Import routes
const picksRouter = require('./routes/picks-route');
const rostersRouter = require('./routes/rosters-route');
const authRouter = require('./routes/auth-route');
const usersRouter = require('./routes/users-route');
const scoresRouter = require('./routes/scores-route');

// Set default port for express app
const PORT = process.env.PORT || 4001;

// Create express app
const app = express();
const schedule = require('node-schedule');

// Apply middleware
// Note: Keep this at the top, above routes
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(morgan('tiny'));
app.use(helmet());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/picks', picksRouter);
app.use('/rosters', rostersRouter);
app.use('/users', usersRouter);
app.use('/scores', scoresRouter);
app.use('/', authRouter);

// Implement 500 error route
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something is broken.');
});

// Implement 404 error route
app.use(function(req, res, next) {
	res.status(404).send('Sorry we could not find that.');
});

// Start express app
app.listen(PORT, function() {
	console.log(`Server is running on: ${PORT}`);
});
