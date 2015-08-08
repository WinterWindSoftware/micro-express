var app = require('../../server');
var request = require('supertest');
var _ = require('lodash');
var should = require('should');

describe('/api/assets', () => {

    describe('GET /:id', ()=> {
        it('should response with 404 for invalid IDs', (done) => {
            var badId = '805bc915-5740-4b85-8cbf-c7bc7fe9e11c'; //Cinegy GUID style ID
            request(app)
                .get(`/api/assets/${badId}`)
                .expect(404)
                .expect('Content-Type', /json/).
                end(done);
        });
    });

    describe('POST /search', () => {
        it('should respond with hits sorted by relevance by default', function(done) {
            var searchCriteria = {
                query: 'golf'
            };
            searchRequest(searchCriteria).end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var response = res.body;
                verifyStandardResponseFields(response);
                //Verify sorted by relevance
                var lastScore = 9999999;
                _.each(response.hits.hits, function(hit) {
                    verifyStandardHitFields(hit);
                    hit._score.should.be.within(hit._score, lastScore);
                    lastScore = hit._score;
                });

                done();
            });
        });

        it('should sort results by transmission date descending', function(done) {
            var searchCriteria = {
                query: 'golf',
                sortType: 'transmissionDate-desc'
            };
            searchRequest(searchCriteria).end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var response = res.body;
                verifyStandardResponseFields(response);
                //Verify sorted by date
                var lastDate = new Date();
                _.each(response.hits.hits, function(hit) {
                    verifyStandardHitFields(hit);
                    if (hit._source.transmissionDate) {
                        var thisDate = new Date(hit._source.transmissionDate);
                        should.ok(thisDate <= lastDate, 'Date not in expected range');
                        lastDate = thisDate;
                    }
                });

                done();
            });
        });
        it('should sort results by transmission date ascending', function(done) {
            var searchCriteria = {
                query: 'golf',
                sortType: 'transmissionDate-asc'
            };
            searchRequest(searchCriteria).end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var response = res.body;
                verifyStandardResponseFields(response);
                //Verify sorted by date
                var lastDate = new Date(1800, 1, 1);
                _.each(response.hits.hits, function(hit) {
                    verifyStandardHitFields(hit);
                    if (hit._source.transmissionDate) {
                        var thisDate = new Date(hit._source.transmissionDate);
                        should.ok(thisDate >= lastDate, 'Date not in expected range');
                        lastDate = thisDate;
                    }
                });

                done();
            });
        });

        it('should allow searching with only a date range filter (no full-text query specified)', function(done) {
            var searchCriteria = {
                dateRange: {
                    start: '1920-09-14T23:00:00.000Z',
                    end: '2015-06-15T11:55:48.163Z'
                }
            };
            searchRequest(searchCriteria).end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var response = res.body;
                verifyStandardResponseFields(response);
                response.hits.total.should.be.greaterThan(0);
                done();
            });
        });

        it('should send 400 BAD REQUEST when empty body is posted', function(done) {
            searchRequest({}, 400).end(done);
        });

        describe('should send 400 BAD REQUEST for special characters in the search query, such as', () => {
            var runBadRequest = (query, done) => {
                var searchCriteria = {
                    query: query
                };
                searchRequest(searchCriteria, 400).end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.body.error.should.be.instanceof(String);
                    done();
                });
            };

            it('backslashes', done => {
                runBadRequest('news\\', done);
            });

            it('unclosed parentheses', done => {
                runBadRequest('news(', done);
            });

            it('unclosed double quotes', done => {
                runBadRequest('news"', done);
            });
        });

        function verifyStandardResponseFields(response) {
            response.hits.hits.should.be.instanceof(Array);
            response.hits.total.should.be.instanceof(Number);
        }

        function verifyStandardHitFields(hit) {
            should.exist(hit._source);
            //should.exist(hit._source.transmissionDate);
        }

        function searchRequest(searchCriteria, expectedStatus) {
            return request(app)
                .post('/api/assets/search')
                .send(searchCriteria)
                .expect(expectedStatus || 200)
                .expect('Content-Type', /json/);
        }
    });
});
