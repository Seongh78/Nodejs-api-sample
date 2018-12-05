var express = require('express');
var router = express.Router();
//
const groups = require('./data/groups.json')
const questions = require('./data/questions.json')
const answers = require('./data/answers.json')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(200, { title: 'Express' });
});

/**
 * 
 */
router.get('/:id/answers', function(req, res, next) {
  const id = Number(req.params.id);    
  const data = answers.filter(answer => answer.question_idx === id)

  res.send(200, { 
      status : 200,
      message: "success",
      data
  });
});

module.exports = router;
