import app from '../../server';
import request from 'supertest';
import { assert } from 'chai';
var testHelper = require('../../components/test-helper');

describe('/api/system', () => {
    var authToken;

    before(done => {
        //login
        testHelper.loginTestUser(app, (err, token) => {
            if (err) {
                return done(err);
            }
            authToken = token;
            done();
        });
    });

    describe('GET /', () => {
        it('should respond with system info', (done) => {
            request(app)
                .get('/api/system')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    assert.ok(res.body);
                    done();
                });
        });

        it('should return 401 UNAUTHORIZED for anon users', (done) => {
            request(app)
                .get('/api/system')
                .expect(401)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    assert.ok(res.body.error);
                    done();
                });
        })
    });
});