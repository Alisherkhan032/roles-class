const { TASKS, fillTaskDetails } = require('../db.js');
const { populateTask } = require('../middleware/data.js');
const { canViewTask, canDeleteTask } = require('../permissions.js');
const {paginate} = require('../middleware/pagination.js');

const router = require('express').Router();

router.get('/', filterTasks, paginate ,(req, res) => {
    const detailedTasks = res.paginatedResults.results
        .map(task => fillTaskDetails(task));
    res.paginatedResults.results = detailedTasks;
    res.json(res.paginatedResults);
});
function filterTasks(req, res, next){
    const {users} = req.query;
    
    const usersIdArray = users ? users.split(',').map(user => Number(user)) : [];
    
    req.paginationResource =  TASKS.filter(task => canViewTask(task, req.user)).filter(task => usersIdArray.length === 0 || usersIdArray.includes(task.userId));
    console.log(req.paginationResource);
    next();
}

router.get('/:id', populateTask, authViewTask, (req, res) => {
    res.json(fillTaskDetails(req.task));
});

router.delete('/:id', populateTask, authDeleteTask, (req, res) => {
    console.log("Marked task completed", req.task.id);
    res.status(204).send();
});

function authViewTask(req, res, next) {
    if (!canViewTask(req.task, req.user)) {
        return res.status(401).json({ message: "Not allowed" });
    }
    next();
}

function authDeleteTask(req, res, next) {
    if (!canDeleteTask(req.task, req.user)) {
        return res.status(401).json({ message: "Not allowed" });
    }
    next();
}

module.exports = router;