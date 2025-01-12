const { PROJECTS, TASKS, findTasksByProject, findManager, fillProjectDetails } = require('../db.js');
const { populateProject } = require('../middleware/data.js');
const { canViewProject, canEditProject, canCreateProject } = require('../permissions.js');
const {paginate} = require('../middleware/pagination.js');
const router = require('express').Router();


router.get('/',filterProject,  paginate, (req, res) => {
    res.json(res.paginatedResults);
});

router.get('/:id', populateProject, authViewProject, (req, res) => {
    res.json(fillProjectDetails(req.project));
});

router.post('/', authCreateProject, (req, res) => {
    const { name, managerId } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name and managerId are required' });
    }

    const manager = findManager(managerId);
    if (!manager) {
        return res.status(400).json({ error: 'Manager not found with id: ' + managerId });
    }

    const newProject = {
        id: PROJECTS.length + 1,
        name,
        managerId,
    };
    PROJECTS.push(newProject);
    res.status(201).json(newProject);
});

router.post('/:id/task', populateProject, authChangeProject, (req, res) => {
    const { name, userId } = req.body;
    if (!name || !userId) {
        return res.status(400).json({ error: 'Name, and userId are required' });
    }
    const projectId = req.project.id;
    const newTask = {
        id: TASKS.length + 1,
        name,
        projectId,
        userId,
    };
    TASKS.push(newTask);
    res.status(201).json(newTask);
});

router.delete('/:id', populateProject, authChangeProject, (req, res) => {
    console.log("Marked project completed", req.project.id);
    res.status(204).send();
});

function authViewProject(req, res, next) {
    if (!canViewProject(req.project, req.user)) {
        return res.status(401).json({ message: "Not allowed" });
    }
    next();
}

function authChangeProject(req, res, next) {
    if (!canEditProject(req.project, req.user)) {
        return res.status(401).json({ message: "Not allowed" });
    }
    next();
}

function authCreateProject(req, res, next) {
    if (!canCreateProject(req.user)) {
        return res.status(401).json({ message: "Not allowed" });
    }
    next();
}

function filterProject(req, res, next){
    const {managers,sortBy} = req.query;
    const managerIdArray = managers ? managers.split(',').map(managerId => Number(managerId)) : [];
    
    req.paginationResource =  PROJECTS.filter(project => canViewProject(project, req.user)).filter(project => managerIdArray.length === 0 || managerIdArray.includes(project.managerId)).map(project => {
        const taskCount = findTasksByProject(project.id).length;
        const manager = findManager(project.managerId);
        return {
            ...project,
            taskCount,
            managerName: manager ? manager.username : null,
        };
    });

    if(sortBy && sortBy === 'taskCount'){
        req.paginationResource = req.paginationResource.sort((a,b)=> b.taskCount - a.taskCount);
    }
    next();
}

module.exports = router;        