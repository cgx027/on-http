// Copyright 2016, EMC, Inc.

'use strict';

describe('Http.Api.Notification', function () {
    var notificationApiService;
    var taskProtocol;
    var _;

    var notificationMessage = {
        type: 'task',
        id: '73b8ca01-735b-40d6-897a-7003ef2fa988',
        data: {
            status: 'completed',
            message: 'dummy message',
        }
    };

     var activeTask = {
         taskId: notificationMessage.id,
     }

    before('start HTTP server', function () {
        this.timeout(5000);
        return helper.startServer([]);
    });

    beforeEach('set up mocks', function () {
        notificationApiService = helper.injector.get('Http.Services.Api.Notification');
        taskProtocol = helper.injector.get('Protocol.Task');
        _ = helper.injector.get('_');

        sinon.stub(taskProtocol, 'activeTaskExists').resolves(activeTask);
    });

    afterEach('teardown mocks', function () {
        function resetMocks(obj) {
            _(obj).methods().forEach(function (method) {
                if (typeof obj[method].restore === 'function') {
                    obj[method].restore();
                }
            }).value();
        }
        resetMocks(taskProtocol);
    });

    after('stop HTTP server', function () {
        return helper.stopServer();
    });

    describe('POST /notification', function () {
        it('should return notification detail', function () {
            return helper.request()
            .post('/api/current/notification')
            .send(notificationMessage)
            .expect('Content-Type', /^application\/json/)
            .expect(201, notificationMessage)
        });

        it('should fail with no id in query body', function () {
            return helper.request()
            .post('/api/current/notification')
            .send(_.omit(notificationMessage, 'id'))
            .expect('Content-Type', /^application\/json/)
            .expect(400, { message: 'Missing task ID in request body' })
        });

        it('should fail with invalid ID in query body', function () {
            return helper.request()
            .post('/api/current/notification')
            .send(_.assign({}, notificationMessage, {id: "I am an invalid uuid"}))
            .expect('Content-Type', /^application\/json/)
            .expect(400, { message: 'Invalid taskId, uuid expected' })
        });

        it('should fail with no data in query body', function () {
            return helper.request()
            .post('/api/current/notification')
            .send(_.omit(notificationMessage, 'data'))
            .expect('Content-Type', /^application\/json/)
            .expect(400, { message: 'Data should be an object' })
        });

        it('should fail with data in query body that is not an object', function () {
            return helper.request()
            .post('/api/current/notification')
            .send(_.assign({}, notificationMessage, {data: 'I am a string'}))
            .expect('Content-Type', /^application\/json/)
            .expect(400, { message: 'Data should be an object' })
        });

        it('should fail with no status in query body', function () {
            return helper.request()
            .post('/api/current/notification')
            .send(_.assign({}, notificationMessage, {data: {}}))
            .expect('Content-Type', /^application\/json/)
            .expect(400, { message: 'Missing status in request body' })
        });

        it('should fail with invalid status in query body', function () {
            return helper.request()
            .post('/api/current/notification')
            .send(_.assign({}, notificationMessage, {data: {status: "I am an invalid status"}}))
            .expect('Content-Type', /^application\/json/)
            .expect(400, { message: 'Invalid status' })
        });
    });
});
