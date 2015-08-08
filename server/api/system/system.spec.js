import app from '../../server';
import request from 'supertest';
import {assert} from 'chai';

describe('/api/system', () => {

    describe('GET /', ()=> {
        it('should respond with system info', (done) => {
            request(app)
                .get(`/api/system`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    assert.ok(res.body);
                    done();
                });
        });
    });
});
