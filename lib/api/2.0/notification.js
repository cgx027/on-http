// Copyright 2016, EMC Inc.

'use strict';

var injector = require('../../../index.js').injector;
var controller = injector.get('Http.Services.Swagger').controller;
var notificationApiService = injector.get('Http.Services.Api.Notification');

var postTaskNotification = controller({success: 201}, function(req) {
    var message = req.body || {};
    if(_.isString(message.type) && message.type === 'task' ) {
            return notificationApiService.postTaskNotification(message);
        }
});

module.exports = {
    postTaskNotification: postTaskNotification
};
