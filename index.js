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


//READ: Welcome-Screen
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('documentation.html', { root: 'public' });
});

//READ: Get all movies 2.0 [MONGOOSE]
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(200).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
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

//READ: Get data about a single movie 2.0 [MONGOOSE]
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

//READ: Return data about a genre (description) by name/title
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies
    .filter(movie => movie.genres.some(genre => genre.name === genreName))
    .map(movie => movie.genres.find(genre => genre.name === genreName));

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('Genre not found');
  }
});

//READ: Return data about a director by name
app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.director.firstName + " " + movie.director.lastName === directorName)?.director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('Director not found');
  }
});

//CREATE: New User 2.0 [MONGOOSE]
app.post('/users', (req, res) => {
  Users.findOne({Username: req.body.Username})
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + "already exists");
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

//UPDATE: User Info (username) 1.0 -> deprecated
// app.put('/users/:id', (req, res) => {
//   const { id } = req.params;
//   const updatedUser = req.body;

//   let user = users.find(user => user.id == id);

//   if (user) {
//     user.username = updatedUser.username;
//     res.status(200).json(user);
//   } else {
//     res.status(400).send('User not found');
//   }
// });

//UPDATE: User Info (username) 2.0 [MONGOOSE]
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

//CREATE: Favorite movie 1.0 -> deprecated 
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${user.id}'s favorite movies`);
  } else {
    res.status(400).send('User not found');
  }
});

//CREATE: Favorite movie 2.0 [MONGOOSE]
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, {
    $push: { favoriteMovies: req.params.MovieID }
  },
  { new: true})
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

//DELETE: Favorite movie
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);
  let favoriteMovies = user.favoriteMovies;
  let movieToDelete = favoriteMovies.find(movie => movie.title === movieTitle);

  if (user) {
    favoriteMovies = favoriteMovies.filter(movie => movie.title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${user.id}'s favorite movies`);
  } else {
    res.status(400).send('User not found');
  }
});

//DELETE: User 2.0 [MONGOOSE]
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

//MIDDLEWARE: handle uncaught errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//START SERVER
app.listen(8080, () => {
  console.log('Server listening on port 8080.');
});



