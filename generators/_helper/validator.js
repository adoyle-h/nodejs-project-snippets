'use strict';

var Joi = require('joi');

exports.valid = function(schema) {
    return function(prop) {
        var result = Joi.validate(prop, schema, {
            allowUnknown: true,
        });

        if (result.error) {
            return result.error.annotate();
        } else {
            return true;
        }
    };
};

exports.v = Joi;

