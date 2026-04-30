const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

const getDashboardMetrics = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? { createdBy: req.user._id } : { assignedTo: req.user._id };
    
    const tasks = await Task.find(query);
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed' || t.status === 'submitted').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const overdueTasks = tasks.filter(t => {
      if (t.status === 'completed' || t.status === 'submitted' || !t.dueDate) return false;
      return new Date(t.dueDate) < new Date();
    }).length;
    
    let totalProjects = 0;
    if (req.user.role === 'admin') {
      totalProjects = await Project.countDocuments({ admin: req.user._id });
    } else {
      totalProjects = await Project.countDocuments({ members: req.user._id });
    }

    const totalMembers = await User.countDocuments({ role: 'member' });

    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      totalProjects,
      totalMembers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardMetrics };
