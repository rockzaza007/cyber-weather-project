'use strict';

/**
 * weather-authorization service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::weather-authorization.weather-authorization');
