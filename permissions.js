const { ROLES, findProject } = require("./db")

function canViewProject(project, user) {
    return user.role === ROLES.ADMIN || project.managerId === user.id;
}

function canEditProject(project, user) {
    return project.managerId === user.id;
}

function canCreateProject(user) {
    return user.role === ROLES.ADMIN || (user.role === ROLES.MANAGER && req.body.managerId === user.id);
}

function canDeleteTask(task, user) {
    return task.userId === user.id;
}

function canViewTask(task, user) {
    const project = findProject(task.projectId);
    return task.userId === user.id || canViewProject(project, user);
}

module.exports = {
    canViewProject,
    canEditProject,
    canCreateProject,
    canDeleteTask,
    canViewTask,
}