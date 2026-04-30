const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTaskStatus, addTaskUpdate, submitTask } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTasks)
  .post(protect, admin, createTask);

router.route('/:id')
  .put(protect, updateTaskStatus);

router.route('/:id/update')
  .post(protect, addTaskUpdate);

router.route('/:id/submit')
  .post(protect, submitTask);

module.exports = router;
