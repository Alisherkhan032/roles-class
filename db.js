const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    USER: 'user',
};

const USERS = [
    { id: 1, username: 'admin', role: ROLES.ADMIN },
    { id: 2, username: 'mana1', role: ROLES.MANAGER },
    { id: 3, username: 'mana2', role: ROLES.MANAGER },
    { id: 4, username: 'user1', role: ROLES.USER },
    { id: 5, username: 'user2', role: ROLES.USER },
    { id: 6, username: 'user3', role: ROLES.USER },
    { id: 7, username: 'user4', role: ROLES.USER },
];

const PROJECTS = [
    { id: 1, name: 'project1', managerId: 2 },
    { id: 2, name: 'project2', managerId: 2 },
    { id: 3, name: 'project3', managerId: 3 },
    { id: 4, name: 'project4', managerId: 3 },
    { id: 5, name: 'project5', managerId: 2 },
];

const TASKS = [
    { id: 1, name: 'task1', projectId: 1, userId: 4 },
    { id: 2, name: 'task2', projectId: 2, userId: 2 },
    { id: 3, name: 'task3', projectId: 3, userId: 4 },
    { id: 4, name: 'task4', projectId: 1, userId: 7 },
    { id: 5, name: 'task5', projectId: 2, userId: 5 },
    { id: 6, name: 'task6', projectId: 3, userId: 6 },
    { id: 7, name: 'task7', projectId: 4, userId: 7 },
    { id: 8, name: 'task8', projectId: 4, userId: 4 },
    { id: 9, name: 'task9', projectId: 5, userId: 6 },
    { id: 10, name: 'task10', projectId: 4, userId: 5 },
    { id: 11, name: 'task11', projectId: 5, userId: 7 },
    { id: 12, name: 'task12', projectId: 4, userId: 4 },
];

// methods

function findTask(taskId) {
    return TASKS.find(t => t.id === parseInt(taskId));
}

function fillTaskDetails(task) {
    const project = PROJECTS.find(p => p.id === task.projectId);
    const user = USERS.find(u => u.id === task.userId);
    const manager = project ? USERS.find(u => u.id === project.managerId) : null;
    return {
        ...task,
        projectName: project ? project.name : null,
        managerName: manager ? manager.name : null,
        userName: user ? user.username : null,
    };
}

function findTasksByProject(projectId) {
    return TASKS.filter(task => task.projectId === projectId);
}

function findUser(userId) {
    return USERS.find(u => u.id === parseInt(userId));
}

function findUserByName(username) {
    return USERS.find(u => u.username === username);
}

function findManager(userId) {
    return USERS.find(u => u.id === parseInt(userId) && u.role === ROLES.MANAGER);
}

function findProject(projectId) {
    return PROJECTS.find(p => p.id === parseInt(projectId));
}

function fillProjectDetails(project) {
    const tasksForProject = findTasksByProject(project.id).map(task => {
        const user = findUser(task.userId);
        return {
            ...task,
            userName: user ? user.username : null,
        };
    });
    const manager = USERS.find(u => u.id === project.managerId);
    return {
        ...project,
        managerName: manager ? manager.username : null,
        tasks: tasksForProject,
    };
}

module.exports = {
    ROLES, USERS, PROJECTS, TASKS,
    fillTaskDetails,
    findTasksByProject,
    fillProjectDetails,
    findTask,
    findUser,
    findProject,
    findManager,
    findUserByName,
}
