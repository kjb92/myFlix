const express = require('express'),
morgan = require('morgan');

const app = express();

//Middleware to log all server requests
app.use(morgan('common'));
// Middleware to serve static files from the "public" folder
app.use(express.static('public'));


//Defining routes
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

app.get('/movies', (req, res) => {
  //Create an array with 10 movies
  const topTenMovies = [
    { title: 'Movie 1', year: 2022, director: 'Director 1' },
    { title: 'Movie 2', year: 2021, director: 'Director 2' },
    { title: 'Movie 3', year: 2020, director: 'Director 3' },
    { title: 'Movie 4', year: 2019, director: 'Director 4' },
    { title: 'Movie 5', year: 2018, director: 'Director 5' },
    { title: 'Movie 6', year: 2017, director: 'Director 6' },
    { title: 'Movie 7', year: 2016, director: 'Director 7' },
    { title: 'Movie 8', year: 2015, director: 'Director 8' },
    { title: 'Movie 9', year: 2014, director: 'Director 9' },
    { title: 'Movie 10', year: 2013, director: 'Director 10' },
  ];
  
  //Send response as JSON
  res.json(topTenMovies);
});


//Middleware to handle uncaught errors
app.use((err, res, req, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//Start server
app.listen(8080, () => {
  console.log('Server listening on port 8080.');
});