# myFlix API

myFlix API is a RESTful API that provides access to a collection of movie information and related data. With this API, users can retrieve information on movie titles, genres, ratings, and more. Users can also create their own accounts, add and remove favorite movies, and update their account information.

# Table of Contents

1. [Getting Started](#getting-started)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [API Endpoints](#api-endpoints)
5. [Built With](#built-with)


# Getting Started
For a live test version of the API, simply go to: https://myflix-kjb92.herokuapp.com/ and test the endpoints as indicated below

OR colone the repository and test it using Postman: Follow the instructions below to get a copy of the project up and running on your local machine for development and testing purposes.


# Prerequisites

Node.js - JavaScript runtime environment
MongoDB - Database
npm - Node package manager

## Installation

1. Open your terminal and navigate to the directory where you want to clone the repository.
2. Clone the repository:
```bash
git clone git clone https://github.com/kjb92/myFlix.git
```

2. Navigate to the root directory of the project.
3. Run npm install to install all dependencies.
4. Make sure MongoDB is running on your local machine.
5. Create a .env file in the root directory and add your 
   MongoDB connection URI as CONNECTION_URI.
6. Run npm start to start the server.
7. Open a web browser and navigate to http://localhost:8080 to access the API documentation.


| URL                        | Method | Description                                         |
|----------------------------|--------|-----------------------------------------------------|
| /movies                    | GET    | Get all movies                                      |
| /movies/:title             | GET    | Get data about a single movie by title              |
| /movies/:genreName         | GET    | Get all movies with a specific genre                |
| /movies/:directorName      | GET    | Get all movies with a specific genre                |
| /genres/:genreName         | GET    | Return info about the genre of a movie              |
| /directors/:directorName   | GET    | Return info about the director of a movie           |
| /users                     | POST   | Create a new user                                   |
| /users/:username           | PUT    | Update a user's info by name                        |
| /users/:username/movies/:movieID | POST  | Add a movie to a user's list of favorites      |
| /users/:username/movies/:movieID | DELETE | Remove a movie from user's favorites          |
| /users/:username           | DELETE | Delete a user                                       |


# Built With


Node.js - JavaScript runtime
Express - Backend Framework
MongoDB - Database