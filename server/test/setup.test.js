process.env.NODE_ENV = 'test';

const Project = require('../models/project');
const User = require('../models/user');

// before((done) => {
//     Project.deleteMany({}, function(err) {});
//     User.deleteMany({}, function(err) {});
//     done();
// });

// after((done) => {
//     Project.deleteMany({}, function(err) {});
//     User.deleteMany({}, function(err) {});
//     done();
// });