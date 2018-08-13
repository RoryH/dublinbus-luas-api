'use strict';

const Hapi = require('hapi');
const dbapi = require('./dublinbus.js');
const luas = require('./luas.js');
const inspect = require('util').inspect;
const addCorsHeaders = require('hapi-cors-headers');

// Create a server with a host and port
const server = new Hapi.Server();

const apiServer = (function() {
  server.connection({
      host: 'localhost',
      port: 8000
  });

  server.route({
    method: 'GET',
    path:'/bus/routes',
    handler: async function handler(request, reply) {
      const params = request.params || {};
      let data;
      try {
        data = await dbapi.getRoutes();
      } catch (e) {
        if (e === 'NODATA') {
          return reply({ message: '404 Route not found' }).code(404);
        } else {
          return reply('500 Internal Server Error').code(500);
        }
      }
      return reply(data);
    }
  });

  server.route({
    method: 'GET',
    path:'/bus/route/{route}',
    handler: async function handler(request, reply) {
      const params = request.params || {};
      let data;
      try {
        data = await dbapi.getRouteStops(params.route);
      } catch (e) {
        if (e === 'NODATA') {
          return reply({ message: '404 Route not found' }).code(404);
        } else {
          return reply('500 Internal Server Error').code(500);
        }
      }
      return reply(data);
    }
  });

  server.route({
    method: 'GET',
    path:'/bus/stop/{stopId}',
    handler: async function handler(request, reply) {
      const params = request.params || {};
      let data;
      try {
        data = await dbapi.getStopTimes(params.stopId);
      } catch (e) {
        if (e === 'NODATA') {
          return reply({ message: '404 Stop not found' }).code(404);
        } else {
          return reply('500 Internal Server Error').code(500);
        }
      }
		  return reply(data);
    }
  });

  server.route({
    method: 'GET',
    path:'/luas/stop/{stopId}',
    handler: async function handler(request, reply) {
      const params = request.params || {};
      let data;
      try {
        data = await luas.getStopTimes(params.stopId);
      } catch (e) {
        return reply('504 Gateway Timeout').code(504);
      }

      if (data) {
        return reply(data);
      } else {
        return reply('404 Not Found').code(404);
      }
    }
  });

  server.route({
    method: 'GET',
    path:'/luas/stops',
    handler: function handler(request, reply) {
      const params = request.params || {};
      let data;
      try {
        data = luas.getStations(params.stopId);
      } catch (e) {
        return reply('504 Gateway Timeout').code(504);
      }

      if (data) {
        return reply(data);
      } else {
        return reply('404 Not Found').code(404);
      }
    },
    config: {
      cache: {
        expiresIn: 60 * 60 * 1000,
        privacy: 'public'
      }
    }
  });

  return {
    start: function () {
      // Start the server
      server.start((err) => {
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
      });

      server.ext('onPreResponse', addCorsHeaders);

      return server;
    }
  }
})();

module.exports = apiServer;
