// Copyright 2016, EMC, Inc.

'use strict';

describe('Http.Api.Notification', function () {
    var notificationApiService;

    var notificationMessage = {
        type: 'task',
        id: '73b8ca01-735b-40d6-897a-7003ef2fa988',
        data: {
            status: 'completed',
            message: 'dummy message',
        }
    };

    before('start HTTP server', function () {
        this.timeout(5000);
        return helper.startServer([]);
    });

    beforeEach('set up mocks', function () {
        notificationApiService = helper.injector.get('Http.Services.Api.Notification');
        sinon.stub(notificationApiService, 'postTaskNotification').resolves(notificationMessage);
    });

    afterEach('teardown mocks', function () {
        function resetMocks(obj) {
            _(obj).methods().forEach(function (method) {
                if (typeof obj[method].restore === 'function') {
                    obj[method].restore();
                }
            }).value();
        }
        resetMocks(notificationApiService);
    });

    after('stop HTTP server', function () {
        return helper.stopServer();
    });

    describe('POST /notification', function () {
        it('should return notification detail', function () {
            return helper.request()
            .post('/api/2.0/notification')
            .send(notificationMessage)
            .expect('Content-Type', /^application\/json/)
            .expect(201, notificationMessage)
            .then(function () {
                expect(notificationApiService.postTaskNotification).to.have.been.calledOnce;
                expect(notificationApiService.postTaskNotification).to.have.been.calledWith(notificationMessage);
            });
        });
    });
});
