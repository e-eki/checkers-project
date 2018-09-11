
const express = require('express');

let router = express.Router();

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//----- endpoint: /api/test/
router.route('/test')
  .get(function(req, res, next) {
    console.log('Get a random book');
    res.send('Get a random book');
  })
  .post(function(req, res, next) {
    console.log('Add a random book', req.body);
    res.send('Add a book');
  })
  .put(function(req, res, next) {
    console.log('Update a random book');
    res.send('Update the book');
  })
  .delete(function(req, res, next) {
    console.log('delete a random book');
    res.send('delete the book');
  })
;

module.exports = router;
