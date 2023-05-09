const movies = [  
  {    
    title: 'The Lord of the Rings: The Two Towers',    
    description: 'Frodo and Sam continue their journey to Mordor to destroy the One Ring, while Aragorn, Legolas, and Gimli prepare for a final battle against Saruman and his army of orcs at the fortress of Helm\'s Deep.',    
    genre: [ 
      { 
        name: 'Action',        
        description: 'Action movies usually involve high-energy, physical stunts and chases, and may or may not have a lot of dialogue.'      
      }         
    ],
    director: {
      name: 'Peter Jackson',
      bio: 'Peter Jackson is a New Zealand film director, producer, and screenwriter. He is best known for his epic adaptations of J. R. R. Tolkien\'s novels, The Lord of the Rings trilogy and The Hobbit trilogy, both of which were filmed in his native New Zealand.',
      birth: '1961',
      death: ''
    },
    imagePath: 'https://m.media-amazon.com/images/I/51W9FVYZ7RL.jpg',
    featured: false
  },
  {
    title: 'Kill Bill: Vol. 1',
    description: 'After awakening from a four-year coma, a former assassin wreaks vengeance on the team of assassins who betrayed her.',
    genre: [
      {
        name: 'Drama',
        description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
      }
    ],
    director: {
      name: 'Quentin Tarantino',
      bio: 'Quentin Tarantino is an American filmmaker and screenwriter known for his nonlinear storytelling, stylized violence, and eclectic soundtracks.',
      birth: '1963',
      death: ''
    },      
    imagePath: 'https://m.media-amazon.com/images/I/514W87SBYHL._SY445_.jpg',
    featured: false
  },
  {
    title: 'The Hateful Eight',
    description: 'In the dead of a Wyoming winter, a bounty hunter and his prisoner find shelter in a cabin currently inhabited by a collection of nefarious characters.',
    genre: [ 
      { 
        name: 'Action', 
        description: 'Action movies usually involve high-energy, physical stunts and chases, and may or may not have a lot of dialogue.' 
      } 
    ],
    director: {
      name: 'Quentin Tarantino',
      bio: 'Quentin Tarantino is an American filmmaker and screenwriter known for his nonlinear storytelling, stylized violence, and eclectic soundtracks.',
      birth: '1963',
      death: ''
    },       
    imagePath: 'https://m.media-amazon.com/images/I/91L6M95tlKL._SL1500_.jpg',
    featured: false
  },
  {
    title: 'Django Unchained',
    description: 'With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.',
    genre: [ 
      { 
        name: 'Action', 
        description: 'Action movies usually involve high-energy, physical stunts and chases, and may or may not have a lot of dialogue.' 
      } 
    ],
    director: {
      name: 'Quentin Tarantino',
      bio: 'Quentin Tarantino is an American filmmaker and screenwriter known for his nonlinear storytelling, stylized violence, and eclectic soundtracks.',
      birth: '1963',
      death: ''
    },
    imagePath: 'https://m.media-amazon.com/images/I/81-FFd6v00L._SL1500_.jpg',
    featured: true
  },
  {
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    genre: [ 
      { 
        name: 'Drama', 
        description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.' 
      } 
    ],
    director: {
      name: 'Frank Darabont',
      bio: 'Frank Darabont is an American film director, screenwriter, and producer who is best known for his work in the horror and thriller genres, including The Shawshank Redemption and The Green Mile.',
      birth: '1959',
      death: ''
    },
    imagePath: 'https://m.media-amazon.com/images/I/51zUbui+gbL._SY445_.jpg',
    featured: false
  },
  {
    title: 'Once Upon a Time in Hollywood',
    description: 'A faded television actor and his stunt double strive to achieve fame and success in the film industry during the final years of Hollywood\'s Golden Age in 1969 Los Angeles.',
    genre: [ 
      { 
        name: 'Drama', 
        description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.' 
      } 
    ],
    director: {
      name: 'Quentin Tarantino',
      bio: 'Quentin Tarantino is an American filmmaker and screenwriter known for his nonlinear storytelling, stylized violence, and eclectic soundtracks.',
      birth: '1963',
      death: ''
    },
    imagePath: 'https://m.media-amazon.com/images/I/81EHuj38IyL._SL1500_.jpg',
    featured: false
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: [ 
      { 
        name: 'Action', 
        description: 'Action movies usually involve high-energy, physical stunts and chases, and may or may not have a lot of dialogue.' 
      } 
    ],
    director: {
      name: 'Christopher Nolan',
      bio: 'Christopher Nolan is a British-American film director, producer, and screenwriter who is best known for his work on the Dark Knight trilogy, Inception, and Interstellar.',
      birth: '1970',
      death: ''
    },
    imagePath: 'https://m.media-amazon.com/images/I/91KkWf50SoL._SL1500_.jpg',
    featured: true
  },
  {
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    genre: [ 
      { 
        name: 'Drama',        
        description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'      
      }         
    ],
    director: {
      name: 'Francis Ford Coppola',
      bio: 'Francis Ford Coppola is an American film director, producer, and screenwriter. He is best known for directing the films The Godfather, Apocalypse Now, and The Conversation.',
      birth: '1939',
      death: ''
    },
    imagePath: 'https://m.media-amazon.com/images/I/81I0Ms9O9YL._SL1500_.jpg',
    featured: true
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    description: 'A young hobbit, Frodo, who has found the One Ring that belongs to the Dark Lord Sauron, begins his journey with eight companions to Mount Doom, the only place where it can be destroyed.',
    genre: [ 
      { 
        name: 'Fantasy',        
        description: 'Fantasy movies often involve magic, mythical creatures, and imaginary worlds that are not bound by the laws of physics or reality.'      
      },
      { 
        name: 'Action',        
        description: 'Action movies usually involve high-energy, physical stunts and chases, and may or may not have a lot of dialogue.'      
      }   
    ],
    director: {
      name: 'Peter Jackson',
      bio: 'Peter Jackson is a New Zealand film director, producer, and screenwriter. He is best known for his epic adaptations of J. R. R. Tolkien\'s novels, The Lord of the Rings trilogy and The Hobbit trilogy, both of which were filmed in his native New Zealand.',
      birth: '1961',
      death: ''
    },
    imagePath: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg',
    featured: false
  },
  {
    title: 'The Lord of the Rings: The Return of the King',
    description: 'Gandalf and Aragorn lead the armies of Men against Sauron\'s forces in a final battle for Middle-earth, while Frodo and Sam continue their dangerous journey to Mount Doom to destroy the One Ring and save Middleearth from darkness.',
    genre: [ 
      { 
        name: 'Fantasy',        
        description: 'Fantasy movies often involve magic, mythical creatures, and imaginary worlds that are not bound by the laws of physics or reality.'      
      },
      { 
        name: 'Action',        
        description: 'Action movies usually involve high-energy, physical stunts and chases, and may or may not have a lot of dialogue.'      
      }   
    ],
    director: {
      name: 'Peter Jackson',
      bio: 'Peter Jackson is a New Zealand film director, producer, and screenwriter. He is best known for his epic adaptations of J. R. R. Tolkien\'s novels, The Lord of the Rings trilogy and The Hobbit trilogy, both of which were filmed in his native New Zealand.',
      birth: '1961',
      death: ''
    },
    imagePath: 'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg',
    featured: false
  }
];

db.movies.insertMany(movies);

