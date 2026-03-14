const express = require('express');
const taskController = require('../controllers/taskController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', requireAuth, taskController.createTask);
router.get('/', requireAuth, taskController.getTasks);
router.put('/:id', requireAuth, taskController.updateTask);
router.delete('/:id', requireAuth, taskController.deleteTask);

module.exports = router;
