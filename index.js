const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
uuid = require('uuid');

//Import mongoose and models.js
const mongoose = require('mongoose'),
Models = require('./models.js'),
Movies = Models.Movie,
Users = Models.User,
Genre = Models.Genre,
Director = Models.Director;

//Import express-validator
const { check, validationResult } = require('express-validator');

//Connect to local db
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

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
let allowedOrigins = ['http://localhost:8080']; //enter all trusted origins

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
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
  .then((movies) => {
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
    res.status(200).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//READ: Get a user by username [MONGOOSE + AUTH]
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({Username: req.params.Username})
  .then((user) => {
    res.status(200).json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//READ: Get data about a single movie [MONGOOSE + AUTH]
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({Title: req.params.Title})
  .then((movie) => {
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

  // Find the genre with the given genre name
  Genre.findOne({ Name: genreName })
    .then((genre) => {
      if (!genre) {
        return res.status(404).send('Genre not found.');
      }

      // Find all the movies that belong to the genre with the given genre ID
      Movies.find({ Genre: { $in: [ new mongoose.Types.ObjectId(genre._id) ] } })
        .then((movies) => {
          if (!movies.length) {
            return res.status(404).send('No movies found for the given genre.');
          }
          res.json(movies);
        })
        .catch((error) => {
          console.error('Error finding movies:', error);
          res.status(500).send('Internal server error.');
        });
    })
    .catch((error) => {
      console.error('Error finding genre:', error);
      res.status(500).send('Internal server error.');
    });
});

//READ: Return data about a genre by name/title [MONGOOSE + AUTH]
app.get('/movies/genre/:genreName/details', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genre.findOne({Name: req.params.genreName})
  .then((genre) => {
    res.status(200).json(genre);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send("Error: " + error);
  });
});

//READ: Get all movies related to a certain director [MONGOOSE + AUTH]
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
  let directorName = req.params.directorName;

  // Find the genre with the given director name
  Director.findOne({ Name: directorName })
    .then((director) => {
      if (!director) {
        return res.status(404).send('Director not found.');
      }

      // Find all the movies that belong to the director with the given director ID
      Movies.find({ Director: new mongoose.Types.ObjectId(director._id) })
        .then((movies) => {
          if (!movies.length) {
            return res.status(404).send('No movies found for the given director.');
          }
          res.json(movies);
        })
        .catch((error) => {
          console.error('Error finding movies:', error);
          res.status(500).send('Internal server error.');
        });
    })
    .catch((error) => {
      console.error('Error finding director:', error);
      res.status(500).send('Internal server error.');
    });
});

//READ: Return data about a director by name [MONGOOSE + AUTH]
app.get('/movies/director/:directorName/details', passport.authenticate('jwt', { session: false }), (req, res) => {
  Director.findOne({Name: req.params.directorName})
  .then((director) => {
    res.status(200).json(director);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send("Error: " + error);
  });
});

//CREATE: New User [MONGOOSE]
app.post('/users',
  //Validation Rules
  [check('Username', 'Username is required').isLength({min: 5}),
      check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
      check('Password', 'Password is required').not().isEmpty(),
      check('Email', 'Email does not appear to be valid').isEmail()
    ],
  (req, res) => {
  // Check the validation object for errors
   let errors = validationResult(req);

   if (!errors.isEmpty()) {
     return res.status(422).json({ errors: errors.array() });
   }
  // Lookup user
  Users.findOne({Username: req.body.Username})
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + " already exists");
    } else {
      Users
        .create({
          Username: req.body.Username,
          Password: Users.hashPassword(req.body.Password), // Hash password
          Email: req.body.Email,
          Birthday: req.body.Birthday
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
app.put('/users/:Username',
  //Validation Rules
  [check('Username', 'Username is required').isLength({min: 5}),
      check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
      check('Password', 'Password is required').not().isEmpty(),
      check('Email', 'Email does not appear to be valid').isEmail()
  ],
  passport.authenticate('jwt', { session: false }), (req, res) => {
  // Check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username, 
      Password: Users.hashPassword(req.body.Password),
      Email: req.body.Email,
      Birthday: req.body.Birthday
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
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, {
    $push: { favoriteMovies: req.params.MovieID }
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
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, {
    $pull: { favoriteMovies: req.params.MovieID }
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndDelete({ Username: req.params.Username })
  .then((user) => {
    // Handle success
    if (!user) {
      res.status(400).send(req.params.Username + " was not found");
    } else {
      res.status(200).send(req.params.Username + " was deleted");
    } 
  })
  .catch((error) => {
    // Handle error
    console.error(error);
    res.status(500).send("Error: " + error);
  })
});

//DELETE: Movie [MONGOOSE + AUTH]
app.delete('/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOneAndDelete({ _id: req.params.MovieID })
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
app.listen(8080, () => {
  console.log('Server listening on port 8080.');
});



