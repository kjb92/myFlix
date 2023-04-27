const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
uuid = require('uuid'),
//Import mongoose and models.js
mongoose = require('mongoose'),
Models = require('./models.js'),
Movies = Models.Movie,
Users = Models.User,
Genre = Models.Genre,
Director = Models.Director;

//Connect to local db
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

//MIDDLEWARE: log all server requests
app.use(morgan('common'));
// Middleware to serve static files from the "public" folder
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Import auth.js
let auth = require('./auth') (app);

//Import passport module
const password = require('passport');
require ('./passport');


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

//READ: Get all users [MONGOOSE]
app.get('/users', (req, res) => {
  Users.find()
  .then((users) => {
    res.status(200).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//READ: Get a user by username [MONGOOSE]
app.get('/users/:Username', (req, res) => {
  Users.findOne({Username: req.params.Username})
  .then((user) => {
    res.status(200).json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//READ: Get data about a single movie [MONGOOSE]
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({Title: req.params.Title})
  .then((movie) => {
    res.status(200).json(movie);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send("Error: " + error);
  });
});

//READ: Return data about a genre by name/title [MONGOOSE]
app.get('/movies/genre/:genreName', (req, res) => {
  Genre.findOne({Name: req.params.genreName})
  .then((genre) => {
    res.status(200).json(genre);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send("Error: " + error);
  });
});

//READ: Return data about a director by name [MONGOOSE]
app.get('/movies/director/:directorName', (req, res) => {
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
app.post('/users', (req, res) => {
  Users.findOne({Username: req.body.Username})
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + " already exists");
    } else {
      Users
        .create({
          Username: req.body.Username,
          Password: req.body.Password,
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

//UPDATE: User Info [MONGOOSE]
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username, 
      Password: req.body.Password,
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

//CREATE: Favorite movie [MONGOOSE]
app.post('/users/:Username/movies/:MovieID', (req, res) => {
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

//DELETE: Favorite movie [MONGOOSE]
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
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

//DELETE: User [MONGOOSE]
app.delete('/users/:Username', (req, res) => {
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

//DELETE: Movie [MONGOOSE]
app.delete('/movies/:MovieID', (req, res) => {
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



