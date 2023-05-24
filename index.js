const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
uuid = require('uuid');

//Import mongoose and models.js
const mongoose = require('mongoose'),
Models = require('./models.js'),
Movies = Models.Movie,
Users = Models.User;

//Import express-validator
const { check, validationResult } = require('express-validator');

//Connect to local db
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
//Connect to MongoDB Atlas (Online)
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//Assign express to variable "app"
const app = express();

//MIDDLEWARE: log all server requests
app.use(morgan('common'));
// Middleware to serve static files from the "public" folder
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Import CORS
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'https://dp0276.csb.app']; //enter all trusted origins

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

//Import auth.js
let auth = require('./auth')(app);

//Import passport module
const passport = require('passport');
require('./passport');


//READ: Welcome-Screen [MONGOOSE]
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

//READ: Documentation [MONGOOSE]
app.get('/documentation', (req, res) => {
  res.sendFile('documentation.html', { root: 'public' });
});

//READ: Get all movies [MONGOOSE + AUTH]
app.get('/movies', (req, res) => {
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

//READ: Get all users [MONGOOSE + AUTH]
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

//READ: Get a user by username [MONGOOSE + AUTH]
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

//READ: Get data about a single movie [MONGOOSE + AUTH]
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

//READ: Get all movies related to a certain genre [MONGOOSE + AUTH]
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

//READ: Get all movies related to a certain director [MONGOOSE + AUTH]
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

//READ: Return data about a genre by name/title [MONGOOSE + AUTH]
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

//READ: Return data about a director by name [MONGOOSE + AUTH]
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

//CREATE: New User [MONGOOSE]
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

//UPDATE: User Info [MONGOOSE + AUTH]
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

//CREATE: Favorite movie [MONGOOSE + AUTH]
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

//DELETE: Favorite movie [MONGOOSE + AUTH]
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

//DELETE: User [MONGOOSE + AUTH]
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

//DELETE: Movie [MONGOOSE + AUTH]
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

//MIDDLEWARE: handle uncaught errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//START SERVER
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});



