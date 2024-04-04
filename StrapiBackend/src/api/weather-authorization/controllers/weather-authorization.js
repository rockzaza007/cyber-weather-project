'use strict';

/**
 * weather-authorization controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::weather-authorization.weather-authorization');
