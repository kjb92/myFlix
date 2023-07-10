const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  genre: [
    {
      name: {type: String, required: true},
      description: {type: String, required: true}  
    }
  ],
  director: {
    name: {type: String, required: true},
    bio: {type: String, required: true},
    birth: Date,
    death: Date
  },
  imagePath: String,
  featured: Boolean
});

let userSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  birthday: Date,
  favoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

//Function to hash submitted passwords
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

//Function to compare the submitted hashed passwords with the hashed passwords stored in the database
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

let genreSchema = mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true}
});

let directorSchema = mongoose.Schema({
  name: {type: String, required: true},
  bio: {type: String, required: true},
  birth: Date,
  death: Date
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorSchema);

module.exports.Movie = Movie; 
module.exports.User = User;
module.exports.Genre = Genre;
module.exports.Director = Director;

