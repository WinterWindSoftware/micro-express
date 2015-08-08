import app from '../../server';
import request from 'supertest';
import { assert } from 'chai';

describe('Authentication', () => {

    describe('POST /authenticate', ()=> {
        it('should respond with token for valid credentials', (done) => {
            request(app)
                .post('/api/authenticate')
                .send({
                    username: 'test',
                    password: 'test'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    assert.ok(res.body.token);
                    done();
                });
        });
        it('should response with 400 BAD REQUEST if body is empty', (done)=> {
            request(app)
                .post('/api/authenticate')
                .send({})
                .expect(400)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    assert.ok(res.body.error);
                    done();
                });
        });
        it('should response with 400 BAD REQUEST if username is not provided', (done)=> {
            request(app)
                .post('/api/authenticate')
                .send({
                    username: '',
                    password: 'test'
                })
                .expect(400)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    assert.ok(res.body.error);
                    done();
                });
        });
        it('should response with 400 BAD REQUEST if password is not provided', (done)=> {
            request(app)
                .post('/api/authenticate')
                .send({
                    username: 'test',
                    password: ''
                })
                .expect(400)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    assert.ok(res.body.error);
                    done();
                });
        });

        it('should response with 401 UNAUTHORIZED if invalid credentials are provided', (done)=> {
            request(app)
                .post('/api/authenticate')
                .send({
                    username: 'test',
                    password: 'wrongpw'
                })
                .expect(401)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    assert.ok(res.body.error);
                    done();
                });
        });
    });
});
