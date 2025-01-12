const { findProject, findTask } = require('../db.js');

function populateProject(req, res, next) {
    const project = findProject(req.params.id);
    if (project === null) {
        return res.status(404).json({ error: 'Project not found' });
    }
    req.project = project;
    next();
}

function populateTask(req, res, next) {
    const task = findTask(req.params.id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    req.task = task;
    next();
}


module.exports = {
    populateProject,
    populateTask,
}