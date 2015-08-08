import request from 'supertest';

export function loginUser(user, app, done) {
    return request(app).post('/api/authenticate').send(user).end((err, res) => {
        if (err) {
            return done(err);
        }
        done(null, res.body.token);
    });
}

export function loginTestUser(app, done) {
    return loginUser({
        username: 'test',
        password: 'test',
        domain: 'EXTERNAL'
    }, app, done);
}

export function loginTestUser2(app, done) {
    return loginUser({
        username: 'test2',
        password: 'test',
        domain: 'EXTERNAL'
    }, app, done);
}
