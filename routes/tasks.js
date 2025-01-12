const { TASKS, fillTaskDetails } = require('../db.js');
const { populateTask } = require('../middleware/data.js');
const { canViewTask, canDeleteTask } = require('../permissions.js');
const {paginate} = require('../middleware/pagination.js');

const router = require('express').Router();

router.get('/', paginate ,(req, res) => {
    const detailedTasks = res.paginatedResults.results
        .filter(task => canViewTask(task, req.user))
        .map(task => fillTaskDetails(task));
    res.paginatedResults.results = detailedTasks;
    res.json(res.paginatedResults);
});

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