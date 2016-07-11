// Copyright 2016, EMC Inc.

'use strict';

var injector = require('../../../index.js').injector;
var controller = injector.get('Http.Services.Swagger').controller;
var nodes = injector.get('Http.Services.Api.Nodes');
var workflowApiService = injector.get('Http.Services.Api.Workflows');
var _ = injector.get('_'); // jshint ignore:line
var constants = injector.get('Constants');
var Errors = injector.get('Errors');

var nodesGetAll = controller(function() {
    return nodes.getAllNodes();
});

var nodesPost = controller({success: 201}, function(req) {
    return nodes.postNode(req.body);
});

var nodesGetById = controller(function(req) {
    return nodes.getNodeById(req.swagger.params.identifier.value);
});

var nodesPatchById = controller(function(req) {
    return nodes.patchNodeById(req.swagger.params.identifier.value, req.body);
});

var nodesDelById = controller(function(req) {
    return nodes.delNodeById(req.swagger.params.identifier.value);
});

var nodesGetSshById = controller(function(req) {
    return nodes.getNodeSshById(req.swagger.params.identifier.value);
});

var nodesPostSshById = controller({success: 201}, function(req) {
    return nodes.postNodeSshById(req.swagger.params.identifier.value, req.body);
});

var nodesGetCatalogById = controller(function(req) {
    return nodes.getNodeCatalogById(req.swagger.params.identifier.value);
});

var nodesGetCatalogSourceById = controller(function(req) {
    return nodes.getNodeCatalogSourceById(req.swagger.params.identifier.value,
                                          req.swagger.params.source.value);
});

var nodesGetPollersById = controller(function(req) {
    return nodes.getPollersByNodeId(req.swagger.params.identifier.value);
});

var nodesGetWorkflowById = controller(function(req) {
    var newQuery;
    var swaggerQuery = req.swagger.query || [];
    if (_(swaggerQuery).has('active')) {
        if (swaggerQuery.active) {
            newQuery = ({
                _status: constants.Task.ActiveStates
            });
        } else {
            newQuery = ({
                _status: {'!': constants.Task.ActiveStates}
            });
        }
        newQuery = _.merge({}, newQuery, req.query);
    } else {
        newQuery = req.query;
    }

    return workflowApiService.getWorkflowsByNodeId(req.swagger.params.identifier.value,
                                                   newQuery);

});

var nodesPostWorkflowById = controller({success: 201}, function(req) {
    var config = _.defaults(req.swagger.query || {}, req.body || {});
    return nodes.setNodeWorkflow(config, req.swagger.params.identifier.value);
});

var nodesWorkflowActionById = controller({success: 202}, function(req, res) {
    var command = req.body.command;
    var options = req.body.options || {};

    var actionFunctions = {
        cancel: function() {
            return nodes.delActiveWorkflowById(req.swagger.params.identifier.value)
                .then(function(graph) {
                    res.setHeader('Location', '/api/2.0/workflows/' + graph.id);
                    return graph;
                });
        }
    };

    if(!_(actionFunctions).has(command)) {
        throw new Errors.BadRequestError(
            command + ' is not a valid workflow action'
        );
    }
    return actionFunctions[command]();

});

var nodesGetTagsById = controller(function(req) {
    return nodes.getTagsById(req.swagger.params.identifier.value);
});

var nodesDelTagById = controller(function(req) {
    return nodes.removeTagsById(req.swagger.params.identifier.value,
                                req.swagger.params.tagName.value);
});

var nodesPatchTagById = controller(function(req) {
    return nodes.addTagsById(req.swagger.params.identifier.value,
                             req.body.tags);
});

var nodesMasterDelTagById = controller(function(req) {
    return nodes.masterDelTagById(req.swagger.params.tagName.value);
});

module.exports = {
    nodesGetAll: nodesGetAll,
    nodesPost: nodesPost,
    nodesGetById: nodesGetById,
    nodesPatchById: nodesPatchById,
    nodesDelById: nodesDelById,
    nodesGetSshById: nodesGetSshById,
    nodesPostSshById: nodesPostSshById,
    nodesGetCatalogById: nodesGetCatalogById,
    nodesGetCatalogSourceById: nodesGetCatalogSourceById,
    nodesGetPollersById: nodesGetPollersById,
    nodesGetWorkflowById: nodesGetWorkflowById,
    nodesPostWorkflowById: nodesPostWorkflowById,
    nodesWorkflowActionById: nodesWorkflowActionById,
    nodesGetTagsById: nodesGetTagsById,
    nodesDelTagById: nodesDelTagById,
    nodesPatchTagById: nodesPatchTagById,
    nodesMasterDelTagById: nodesMasterDelTagById
};
