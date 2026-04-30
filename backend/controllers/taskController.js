const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find({ createdBy: req.user._id })
        .populate('project', 'title')
        .populate('assignedTo', 'name')
        .populate('createdBy', 'name')
        .populate('updates.addedBy', 'name');
    } else {
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate('project', 'title')
        .populate('assignedTo', 'name')
        .populate('createdBy', 'name')
        .populate('updates.addedBy', 'name');
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  const { title, description, status, dueDate, project, assignedTo } = req.body;

  try {
    const task = new Task({
      title,
      description,
      status: status || 'todo',
      dueDate,
      project,
      assignedTo,
      createdBy: req.user._id
    });

    const createdTask = await task.save();
    const populatedTask = await Task.findById(createdTask._id)
      .populate('project', 'title')
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name');
      
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  const { status, progress } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Both admin and assigned user can update status/progress
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    if (status) task.status = status;
    if (progress !== undefined) task.progress = progress;
    
    const updatedTask = await task.save();
    
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('project', 'title')
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name')
      .populate('updates.addedBy', 'name');

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addTaskUpdate = async (req, res) => {
  const { message } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    task.updates.push({
      message,
      addedBy: req.user._id,
      timestamp: new Date()
    });

    const updatedTask = await task.save();
    
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('project', 'title')
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name')
      .populate('updates.addedBy', 'name');

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitTask = async (req, res) => {
  const { notes, link } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to submit this task' });
    }

    task.status = 'submitted';
    task.submission = {
      notes,
      link,
      submittedAt: new Date()
    };

    const updatedTask = await task.save();
    
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('project', 'title')
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name')
      .populate('updates.addedBy', 'name');

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTaskStatus, addTaskUpdate, submitTask };
