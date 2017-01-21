'use strict';

const Hapi = require('hapi');
const dbapi = require('./dublinbus.js');
const luas = require('./luas.js');
const inspect = require('util').inspect;

// Create a server with a host and port
const server = new Hapi.Server();

const apiServer = (function() {
  server.connection({
      host: 'localhost',
      port: 8000
  });

  // Add the route
  server.route({
    method: 'GET',
    path:'/bus/route/{route}',
    handler: async function handler(request, reply) {
        const params = request.params || {};
        let data;
        try {
            data = await dbapi.getRouteStops(params.route);
        } catch (e) {
            return reply('504 Gateway Timeout').code(504);
        }
        if (data.GetStopDataByRouteResult.diffgram !== null) {
            return reply(data.GetStopDataByRouteResult.diffgram.StopDataByRoute);
        } else {
            return reply('404 Not Found').code(404);
        }
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
            return reply('504 Gateway Timeout').code(504);
        }

        if (data.GetRealTimeStopDataResult.diffgram !== null) {
            return reply(data.GetRealTimeStopDataResult.diffgram.DocumentElement.StopData);
        } else {
            return reply('404 Not Found').code(404);
        }
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

      return server;
    }
  }
})();

module.exports = apiServer;