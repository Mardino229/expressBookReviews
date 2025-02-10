const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let bookList = Object.entries(books).map(([id, book]) => ({
  isbn: Number(id),
  ...book
}));

public_users.post("/register", (req,res) => {

  username = req.body.username;
  password = req.body.password;

  if (isValid(username)) {
    if (!(password === "" || username === "")){
      users.push({
        username: username,
        password: password
      })
      return res.send({message: `User ${username} registered successfully`});
    }
    return res.send({message: "Password or username is empty"});
  }
  return res.send({message: "User already registered"});
});

// Get the book list available in the shop
public_users.get('/',async (req, res) => {
  //Write your code here
  return res.send(JSON.stringify(books));
});

public_users.get('/async',async function (req, res)  {

  try {
    const response = await axios.get('http://localhost:5000/');

    return res.send(JSON.stringify(response.data));

  } catch (err){

    return res.status(err.response.status).send(JSON.stringify(err));

  }

});

public_users.get('/async/:isbn',async function (req, res)  {

  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

    return res.send(JSON.stringify(response.data));

  } catch (err){

    return res.status(err.response.status).send(JSON.stringify(err));

  }

});

public_users.get('/async/title/:title',async function (req, res)  {

  const title = req.params.title;

  try {
    const response = await axios.get('http://localhost:5000/title/' + title);

    return res.send(JSON.stringify(response.data));

  } catch (err){

    return res.status(err.response.status).send(JSON.stringify(err));

  }

});

public_users.get('/async/author/:author',async function (req, res)  {

  const author = req.params.author;

  try {
    const response = await axios.get('http://localhost:5000/author/' + author);

    return res.send(JSON.stringify(response.data));

  } catch (err){

    return res.status(err.response.status).send(JSON.stringify(err));

  }

});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

  const isbn = req.params.isbn;

  let b = bookList.filter((book)=>
    book.isbn === parseInt(isbn)
  );
  return res.send(b);
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

  const author = req.params.author;

  let b = bookList.filter((book)=>
      book.author === author
  );

  return res.send(JSON.stringify(b));

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  const title = req.params.title;

  let b = bookList.filter((book)=>
      book.title === title
  );

  return res.send(JSON.stringify(b));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const isbn = req.params.isbn;

  let b = bookList.filter((book)=>
      book.isbn === parseInt(isbn)
  );
  let reviews = b[0].reviews;
  return res.send(JSON.stringify(reviews));
});

module.exports.general = public_users;
