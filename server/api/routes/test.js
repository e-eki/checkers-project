
const express = require('express');

const db = require('../utils/mongoDbUtils');

db.setUpConnection();
let router = express.Router();

//----- endpoint: /api/test/
router.route('/test')
  .get(function(req, res) {
    
    db.listNotes()
      .then((data) => {
        res.send(data)
      });
  })
  .post(function(req, res) {

    db.createNote(req.body)
      .then((data) => {
        res.send(data)
      });
  })
  
  
;

router.route('/test/:id')
  .get(function(req, res) {
    
    db.listNotes(req.params.id)
      .then((data) => {
        res.send(data)
      });
  })
  .put(function(req, res) {
    db.updateNote(req.params.id, req.body)
      .then((data) => {
        res.send(data)
      });
  })
  .delete(function(req, res) {
    
    db.deleteNote(req.params.id)
      .then((data) => {
        res.send(data)
      })
      .catch((error) => {
        res.send(error);
      })
  })

module.exports = router;
