const express = require('express'),
morgan = require('morgan'),
uuid = require('uuid');

const app = express();

//VAR: Sample Users
let users = [
  {
    id: 1,
    username: 'kevin',
    firstName: 'Kevin',
    lastName: 'Blumenstock',
    favoriteMovies: []
  }
];

//VAR: Sample Movies
let movies = [
  {
    title: 'The Lion King',
    description: 'A young lion prince flees his kingdom after the murder of his father. Years later, he returns to reclaim his throne.',
    director: {
      firstName: 'Roger',
      lastName: 'Allers',
      bio: 'Roger Allers is an American film director, screenwriter, storyboard artist, animator and voice actor. He is best known for co-directing the Disney animated feature The Lion King (1994).',
      dateOfBirth: 1949,
      dateOfDeath: undefined
    },
    genres: [
      {
        name: 'Animation',
        description: 'Animated films are ones in which individual drawings, paintings, or illustrations are photographed frame by frame (stop-frame cinematography).'
      },
      {
        name: 'Adventure',
        description: 'Adventure films are often set in an historical period and may include adapted stories of historical or literary adventure heroes, kings, battles, rebellion, or piracy.'
      },
      {
        name: 'Drama',
        description: 'Drama films are a genre that relies on the emotional and relational development of realistic characters. They often feature intense character development, and sometimes rely on tragedy to evoke an emotional response from the audience.'
      }
    ],
    imageURL: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/wx3wpNh4LhRJ3h6yN3vSGPVepuo.jpg',
    featured: true
  },
  {
    title: 'Beauty and the Beast',
    description: 'A young woman whose father has been imprisoned by a terrifying beast offers herself in his place, unaware that her captor is actually a prince, physically altered by a magic spell.',
    director: {
      firstName: 'Gary',
      lastName: 'Trousdale',
      bio: 'Gary A. Trousdale is an American film director, animator, and storyboard artist, known for directing and producing animated films at Disney.',
      dateOfBirth: 1960,
      dateOfDeath: undefined
    },
    genres: [
      {
        name: 'Animation',
        description: 'Animated films are ones in which individual drawings, paintings, or illustrations are photographed frame by frame (stop-frame cinematography).'
      },
      {
        name: 'Fantasy',
        description: 'Fantasy films are a genre that uses magic and other supernatural forms as a primary element of plot, theme, or setting.'
      },
      {
        name: 'Musical',
        description: 'Musical films feature singing and dancing as a central element of the narrative, often accompanied by a range of different genres of music, such as jazz, rock, and classical music.'
      }
    ],
    imageURL: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/uOw5JD8IlD546feZ6oxbIjvN66P.jpg',
    featured: false
  },
];



//MIDDLEWARE: log all server requests
app.use(morgan('common'));
// Middleware to serve static files from the "public" folder
app.use(express.static('public'));

//CREATE: New User
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.username) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send('Users need usernames');
  }
});

//READ: Welcome-Screen
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('documentation.html', { root: 'public' });
});

//READ: Get all movies
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

//READ: Get data about a single movie
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('Movie not found');
  }
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


//MIDDLEWARE: handle uncaught errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//START SERVER
app.listen(8080, () => {
  console.log('Server listening on port 8080.');
});



