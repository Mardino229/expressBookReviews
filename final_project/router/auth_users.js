const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let bookList = Object.entries(books).map(([id, book]) => ({
  isbn: Number(id),
  ...book
}));
let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let test = users.find(x=>x.username === username);
  return !(test);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.find(x => x.username === username && x.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {

   const {username,password} = req.body;

   if (authenticatedUser(username,password)){
     req.session.token = jwt.sign({username, password}, "my value");
     return res.send({message: `User ${username} login successfully`});
   }
   return res.send({message: `Bad credentials`});
});

const authenticate = (req,res, next) => {
  console.log("ok");
  if (req.session.token){
    jwt.verify(req.session.token, "my value", (err, decoded) => {
      if (err) {
        return res.send({message: `token invalid`});
      }
      req.user = decoded;
      next();
    })
  } else{
    return res.send({message: `User not logged in`}).status(401);
  }
}

// Add a book review
regd_users.put("/auth/review/:isbn", authenticate, (req, res) => {
  //Write your code here


  const isbn = req.params.isbn;

  let b = bookList.filter((book)=>
      book.isbn === parseInt(isbn)
  );

  const reviews = req.body.reviews;

  let user = b[0].reviews.find(x=>x.username === req.user.username);
  console.log(user);
  if (user) {
    user.reviews = reviews;
  } else {
    b[0].reviews.push({
      username: req.user.username,
      reviews: reviews
    })
  }
  return res.send(b[0]);
});

regd_users.delete("/auth/review/:isbn", authenticate, (req, res) => {
  //Write your code here


  const isbn = req.params.isbn;

  let b = bookList.filter((book)=>
      book.isbn === parseInt(isbn)
  );

  let user = b[0].reviews.find(x=>x.username === req.user.username);

  console.log(user);

  if (user) {
    b[0].reviews = b[0].reviews.filter(x=>x.username !== req.user.username);
  }

  return res.send(b[0]);
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
