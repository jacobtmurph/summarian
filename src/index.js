// Load modules
const express = require('express');
const jsonParser = require('body-parser').json;
const formParser = require('body-parser').urlencoded;
const mongoose = require('mongoose');
const routes = require('./routes');
const session = require('express-session');

// Set up the app
const app = express();

// Set up session details
app.use(session({
   secret:'Books are brilliant',
   resave: true,
   saveUninitialized: false
}));

// Set the current user for templates
app.use((req, res, next) => {
   res.locals.currentUser = req.session.userId;
   next();
});

// Set custom views dir
app.set('views', './src/views');

// Set the view engine
app.set('view engine', 'pug');

// Set the static route
app.use('/static', express.static('./src/assets'))

// Set up a MongoDB connection
mongoose.connect("mongodb://localhost:27017/summarian", {useNewUrlParser: true});
const db = mongoose.connection;

// If database connection is successfull
db.on('connected', console.log.bind(console, `Successfully connected to the ${db.name} database.`));

// In the case of a Mongo error
db.on('error', console.error.bind(console, 'connection error:'));


// Set the port
app.set('port', process.env.PORT || 3000);

// Parse incoming json & formdata requests
app.use(formParser({extended: true}));
app.use(jsonParser());

app.use('/', routes);

// Send 404 if no other route matched
app.use((req, res) => {
    res.status(404).json({
      message: 'Route Not Found'
    })
  })
  
  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message,
      error: {}
    });
  });
  
  // start listening on our port
  const server = app.listen(app.get('port'), () => {
    console.log(`Express server is listening on port ${server.address().port}`);
  });
  