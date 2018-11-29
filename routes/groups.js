var express = require('express');
//
const groups = require('./data/groups.json')
const questions = require('./data/questions.json')
//
var router = express.Router();


/**
 * 그룹목록
 */
router.get('/', function(req, res, next) {
    const keyword = req.query.keyword;
    let data = groups;
    if(keyword){
        data = groups.filter(group => group.name.match(keyword))
    }
    res.send(200, {
        status: 200,
        result: "success",
        data
    })
});

/**
 * 그룹상세
 */
router.get('/:id', function(req, res, next) {
    const id = Number(req.params.id);
    const data = groups[groups.findIndex(g=>g.id === id)];
    res.send(200, {
        status: 200,
        result: "success",
        data
    })
});

/**
 * 그룹 - 질문목록
 */
router.get('/:id/questions', function(req, res, next) {
    const id = Number(req.params.id);
    const data = questions.filter(q=>q.group_idx===id)
    res.send(200, {
        status: 200,
        result: "success",
        data
    })
});

module.exports = router;
