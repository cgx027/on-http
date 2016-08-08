// Copyright 2016, EMC, Inc.

'use strict';

var di = require('di');

module.exports = notificationApiServiceFactory;
di.annotate(notificationApiServiceFactory, new di.Provide('Http.Services.Api.Notification'));
di.annotate(notificationApiServiceFactory,
    new di.Inject(
        'Protocol.Events',
        'Protocol.Task',
        'TaskGraph.Store',
        'Logger',
        'Services.Waterline',
        'Errors',
        'Promise',
        '_'
    )
);

function notificationApiServiceFactory(
    eventsProtocol,
    taskProtocol,
    taskGraphStore,
    Logger,
    waterline,
    Errors,
    Promise,
    _
) {
    var logger = Logger.initialize(notificationApiServiceFactory);

    function notificationApiService() {
    }

    notificationApiService.prototype.postTaskNotification = function(message) {
        var self = this;

        return Promise.try(function() {
            if (!message.id || !_.isString(message.id)) {
                throw new Errors.BadRequestError('Missing task ID in request body');
            };
            // message.data should be an object if exist.
            if (!message.data || !_.isObject(message.data)) {
                throw new Errors.BadRequestError('Data should be an object');
            }
            if (!message.data.status || !_.isString(message.data.status)) {
                throw new Errors.BadRequestError('Missing status in request body');
            };
        })
        .then(function () {

            return eventsProtocol.publishTaskNotification(
                message.id,
                message.data
            );
        })
        .then(function () {
            return {
                type: message.type,
                id: message.id,
                data: message.data
            }
        });
    };

    return new notificationApiService();
}
