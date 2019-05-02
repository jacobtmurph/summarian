// Load modules
const express = require('express');
const jsonParser = require('body-parser').json;
const mongoose = require('mongoose');

// Set up the app
const app = express();

// Set up a MongoDB connection
mongoose.connect("mongodb://localhost:27017/summarian", {useNewUrlParser: true});
const db = mongoose.connection;

// If database connection is successfull
db.on('connected', console.log.bind(console, `Successfully connected to the ${db.name} database.`));

// In the case of a Mongo error
db.on('error', console.error.bind(console, 'connection error:'));



// Set the port
app.set('port', process.env.PORT || 3000);

// Parse incoming json requests
app.use(jsonParser());

app.get('/', (req, res) => res.send("<h1>Hello, World!</h1>"))

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
  