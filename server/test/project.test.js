// process.env.NODE_ENV = 'test';

// const Project = require('../models/project');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);

// before((done) => {
//     Project.deleteMany({}, function(err) {});
//     done();
// });

// after((done) => {
//     Project.deleteMany({}, function(err) {});
//     done();
// });

describe('/First Test Collection', () => {

    it('test default API welcome routes...', (done) => {
        chai.request(server)
        .get('/api/welcome')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            const actualVal = res.body.message;
            expect(actualVal).to.be.equal('Welcome to the REST Project Management API');
            done();
        });
    });

    // it('should verify we have 0 project in database', (done) => {
    //     chai.request(server)
    //     .get('/api/project')
    //     .end((err, res) => {
    //         res.should.have.status(200);
    //         res.body.should.be.a('array');
    //         res.body.length.should.be.eql(0);
    //         done();
    //     });
    // });

    it('should post a valid product', (done) => {

        let project = {
            title: "Test Title",
            description: "Test Description",
            stakeholders: "Test Stakeholders"
        }
        chai.request(server)
        .post('/api/project')
        .send(project)
        .end((err, res) => {
            res.should.have.status(201);
            done();
        });
    });

    // it('should verify we have 1 project in database', (done) => {
    //     chai.request(server)
    //     .get('/api/project')
    //     .end((err, res) => {
    //         res.should.have.status(200);
    //         res.body.should.be.a('array');
    //         res.body.length.should.be.eql(1);
    //         done();
    //     });
    // });

    // it('should test two values...', () => {
    //     //actual test content in here
    //     let expectedVal = 10;
    //     let actualVal = 10;

    //     expect(actualVal).to.be.equal(expectedVal);
    // });
});
