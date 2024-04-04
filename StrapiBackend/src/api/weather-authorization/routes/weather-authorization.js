'use strict';

/**
 * weather-authorization router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::weather-authorization.weather-authorization');
