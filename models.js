const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {
    //SWITCH TO REFERENCE ID
    Name: String, 
    Description: String
  },
  Director: {
    //SWITCH TO REFERENCE ID
    Name: String, 
    Bio: String
  },
  //NOT IN DATA MODEL - ONLY EXAMPLE
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  favoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchmea);

module.exports.Movie = Movie; 
module.exports.User = User;

