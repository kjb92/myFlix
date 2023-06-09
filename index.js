const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser')

//Import mongoose and models.js
const mongoose = require('mongoose'),
Models = require('./models.js'),
Movies = Models.Movie,
Users = Models.User;

//Import express-validator
const { check, validationResult } = require('express-validator');

//Allows Mongoose to connect to the database so it can perform CRUD operations on the documents it contains from within the REST API.
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
//Connect to MongoDB Atlas (Online)
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//Assign express to variable "app"
const app = express();

//Middleware to log all server requests
app.use(morgan('common'));
// Middleware to serve static files from the "public" folder
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Import CORS
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'http://localhost:4200', 'https://dp0276.csb.app', 'https://myflix-kjb92.netlify.app', 'https://kjb92.github.io']; //enter all trusted origins

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ 
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));


//Import passport module
const passport = require('passport');
require('./passport');

// * @summary Express GET route located at the endpoint “/” that returns a default textual response
// * @return {object} 200 - success response - application/json
/**
 * GET welcome message from '/' endpoint
 * @name welcomeMessage
 * @kind function
 * @returns welcome message
 */
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

/**
 * GET the API documentation at the "/documentation" endpoint
 * @name documentation
 * @kind function
 * @returns the contents of documentation.html
 */
app.get('/documentation', (req, res) => {
  res.sendFile('documentation.html', { root: 'public' });
});

/**
 * GET a list of all movies at the "/movies" endpoint
 * @name movies
 * @kind function
 * @returns array of movie objects
 * @requires passport
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
  .then((movies) => {
    if (!movies) {
      return res.status(404).send('No movies found.');
    }
    res.status(200).json(movies);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send("Error: " + error);
  });
});

//// READ - Express GET route located at the endpoint "/users" that returns a JSON object containing data about all users

/**
 * GET a list of all users at the "/users" endpoint
 * @name users
 * @kind function
 * @returns array of user objects
 */
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
  .then((users) => {
    if (!users) {
      return res.status(404).send('No users found.');
    }
    res.status(200).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// READ - Express GET route located at the endpoint "/users/:username" that returns data about a single user by username

/**
 * GET a single user by username at the "/users/:username" endpoint
 * @name user
 * @param {string} username user username
 * @kind function
 * @returns user object
 * @requires passport
 */
app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  let username = req.params.username;

  Users.findOne({username: username})
  .then((user) => {
    if (!user) {
      return res.status(404).send('User not found.');
    }
    res.status(200).json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// READ - Express GET route located at the endpoint "/movies/:title" that returns data about a single movie by title to the user

/**
 * GET a single movie by title at the "/movies/[Title]" endpoint
 * @name movie
 * @param {string} title movie title
 * @kind function
 * @returns movie object
 * @requires passport
 */
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  let movieTitle = req.params.title;

  Movies.findOne({title: movieTitle})
  .then((movie) => {
    if (!movie) {
      return res.status(404).send('Movie not found.');
    }
    res.status(200).json(movie);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send("Error: " + error);
  });
});

// READ - Express GET route located at the endpoint "/movies/genre/:genreName" that returns data about all movies with a certain genre by genre name

/**
 * GET all movies with a certain genre by genre name at the "/movies/genre/:genreName" endpoint
 * @name genre
 * @param {string} genreName genre name
 * @kind function
 * @returns array with movie objects 
 * @requires passport
 */
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
  let genreName = req.params.genreName;

  // Find all the movies that belong to the genre with the given name
  Movies.find({ 'genre.name': genreName })
    .then((movies) => {
      if (!movies.length) {
        return res.status(404).send('No movies found for the given genre.');
      }
      res.status(200).json(movies);
    })
    .catch((error) => {
      console.error('Error finding movies:', error);
      res.status(500).send('Internal server error.');
    });
});

// READ - Express GET route located at the endpoint "/movies/director/:directorName" that returns data about all movies with a certain director by director name

/**
 * GET all movies with a certain director by director name at the "/movies/director/:directorName" endpoint
 * @name genre
 * @param {string} directorName director name
 * @kind function
 * @returns array with movie objects 
 * @requires passport
 */
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
  let directorName = req.params.directorName;

  // Find the movie with the given director name
  Movies.find( { 'director.name': directorName } )
    .then((movies) => {
      if (!movies.length) {
        return res.status(404).send('No movies found for the given director.');
      }
      res.status(200).json(movies);
    })
    .catch((error) => {
      console.error('Error finding movies:', error);
      res.status(500).send('Internal server error.');
    });
});

// READ - Express GET route located at the endpoint "/genres/:genreName/" that returns data about a genre (description) by name

/**
 * GET a genre (description) by name at the "/genres/:genreName/" endpoint
 * @name genre
 * @param {string} genreName genre name
 * @kind function
 * @returns genre object
 * @requires passport
 */
app.get('/genres/:genreName/', passport.authenticate('jwt', { session: false }), (req, res) => {
  let genreName = req.params.genreName;

  Movies.findOne({ 'genre.name': genreName })
    .select('genre.$')
    .then((genre) => {
      if (!genre) {
        return res.status(404).send('Genre not found.');
      }

      res.status(200).json(genre.genre[0]);
    })
    .catch((error) => {
      console.error('Error finding genre:', error);
      res.status(500).send('Internal server error.');
    });
});

// READ - Express GET route located at the endpoint "/directors/:directorName/" that returns data about a director by name

/**
 * GET a director by name at the "/directors/:directorName/" endpoint
 * @name genre
 * @param {string} directorName director name
 * @kind function
 * @returns director object
 * @requires passport
 */
app.get('/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
  let directorName = req.params.directorName;

  Movies.findOne({ 'director.name': directorName })
    .select('director')
    .then((director) => {
      if (!director) {
        return res.status(404).send('Director not found.');
      }

      res.status(200).json(director);
    })
    .catch((error) => {
      console.error('Error finding director:', error);
      res.status(500).send('Internal server error.');
    });
});

//CREATE - Allow new users to register

/**
 * Allow new users to register
 * @name registerUser
 * @param {string} username username
 * @param {string} eassword password
 * @param {string} Email email
 * @param {date} birthday birthday
 * @kind function
 */
app.post('/users',
  //Validation Rules
  [check('username', 'Username is required').isLength({min: 5}),
      check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
      check('password', 'Password is required').not().isEmpty(),
      check('email', 'Email does not appear to be valid').isEmail()
    ],
  (req, res) => {
  // Check the validation object for errors
   let errors = validationResult(req);

   if (!errors.isEmpty()) {
     return res.status(422).json({ errors: errors.array() });
   }
  // Lookup user
  Users.findOne( { username: req.body.username } )
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + " already exists");
    } else {
      Users
        .create({
          username: req.body.username,
          password: Users.hashPassword(req.body.password), // Hash password
          email: req.body.email,
          birthday: req.body.birthday
        })
        .then((user) => {res.status(201).json(user)})
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error: " + error);
        })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send("Error: " + error);
  });
});

//UPDATE - Allow users to update their user info (username)

/**
 * Allow users to update their user info
 * @name updateUser
 * @param {string} Username username
 * @param {string} Password password
 * @param {string} Email email
 * @param {date} Birthday birthday
 * @kind function
 * @requires passport
 */
app.put('/users/:username',
  //Validation Rules
  [check('username', 'Username is required').isLength({min: 5}),
      check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
      check('password', 'Password is required').not().isEmpty(),
      check('email', 'Email does not appear to be valid').isEmail()
  ],
  passport.authenticate('jwt', { session: false }), (req, res) => {
  // Check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  Users.findOneAndUpdate( { username: req.params.username }, { $set:
    {
      username: req.body.username, 
      password: Users.hashPassword(req.body.password),
      email: req.body.email,
      birthday: req.body.birthday
    }
  }, 
  { 
    new: true 
  })
  .then((updatedUser) => {
    // Handle success
    res.status(200).json(updatedUser);
    
  })
  .catch((error) => {
    // Handle error
    console.error(error);
    res.status(500).send("Error: " + error);
  })
});

//CREATE - Allow users to add a movie to their list of favorites

/**
 * Allow users to add a movie to their list of favorites 
 * @name addFavoriteMovie
 * @param {string} username username
 * @param {string} movieID movieID
 * @kind function
 * @requires passport
 */
app.post('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate( { username: req.params.username }, {
    $push: { favoriteMovies: req.params.movieID }
  },
  { new: true })
  .then((updatedUser) => {
    // Handle success
    res.status(200).json(updatedUser);
  })
  .catch((error) => {
    // Handle error
    console.error(error);
    res.status(500).send("Error: " + error);
  })
});

//DELETE - Allow users to delete a movie from their list of favorites

/**
 * Allow users to delete a movie from their list of favorites
 * @name deleteFavoriteMovie
 * @param {string} username username
 * @param {string} movieID movieID
 * @kind function
 * @requires passport
 */
app.delete('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ username: req.params.username}, {
    $pull: { favoriteMovies: req.params.movieID }
  },
  { new: true })
  .then((updatedUser) => {
    // Handle success
    res.status(200).json(updatedUser);
  })
  .catch((error) => {
    // Handle error
    console.error(error);
    res.status(500).send("Error: " + error);
  })
});

//DELETE - Allow existing users to deregister (showing only a text that a user has been removed)

/**
 * Allow existing users to deregister (showing only a text that a user has been removed)
 * @name removeUser
 * @param {string} username username
 * @kind function
 * @requires passport
 */
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  let username = req.params.username;

  Users.findOneAndDelete({ username: username })
  .then((user) => {
    // Handle success
    if (!user) {
      res.status(400).send(username + " was not found");
    } else {
      res.status(200).send(username + " was deleted");
    } 
  })
  .catch((error) => {
    // Handle error
    console.error(error);
    res.status(500).send("Error: " + error);
  })
});

//DELETE - Allow users to delete a movie from the database

/**
 * Allow users to delete a movie from the database
 * @name deleteMovie
 * @param {string} movieID movieID
 * @kind function
 * @requires passport
 */
app.delete('/movies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOneAndDelete({ _id: req.params.movieID })
  .then((movie) => {
    // Handle success
    if (!movie) {
      res.status(400).send("Movie was not found");
    } else {
      res.status(200).send("Movie was deleted");
    } 
  })
  .catch((error) => {
    // Handle error
    console.error(error);
    res.status(500).send("Error: " + error);
  })
});

//Middleware to handle uncaught errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//START SERVER
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});



