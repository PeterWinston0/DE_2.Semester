const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const User = require('../models/user');

const { verifyToken } = require("../validation");

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create a new project
router.post('/', verifyToken, async (req, res) => {
  try {
    // Get the email of the logged-in user from the decoded token
    const loggedInUserEmail = req.user.email;

    // Find the user in the database based on their email
    const user = await User.findOne({ email: loggedInUserEmail });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Create a new project using the request body and the user's _id
    const project = new Project({
      title: req.body.title,
      description: req.body.description,
      userId: user._id,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      dropbox: req.body.dropbox,
      github: req.body.github,
      techs: req.body.techs,
      tasks: {}
    });

    // Save the project to the database
    const savedProject = await project.save();

    res.json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Server Error' }); // Return error message as JSON
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Get projects by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    //console.log('User ID:', req.params.userId); // Log the user ID
    const userId = req.params.userId;

    // Find projects with the specified user ID
    const projects = await Project.find({ userId });

    res.json(projects);
  } catch (error) {
    console.error('Error retrieving projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const { tasks, title, description, start_date, end_date, dropbox, github, techs } = req.body;

    const project = await Project.findByIdAndUpdate(req.params.id, { tasks, title, description, start_date, end_date, dropbox, github, techs, }, { new: true });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;

