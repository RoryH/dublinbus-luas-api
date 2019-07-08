'use strict';

const Hapi = require('hapi');
const dbapi = require('./dublinbus2.js');
const luas = require('./luas.js');
const inspect = require('util').inspect;
const addCorsHeaders = require('hapi-cors-headers');

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 8000
});


server.route({
  method: 'GET',
  path:'/bus/routes',
  handler: async function handler(request, h) {
    const params = request.params || {};
    let data;
    try {
      data = await dbapi.getRoutes();
    } catch (e) {
      if (e === 'NODATA') {
        return h.response({ message: '404 Route not found' }).code(404);
      } else {
        return h.response('500 Internal Server Error').code(500);
      }
    }
    return h.response(data);
  }
});

server.route({
  method: 'GET',
  path:'/bus/route/{route}',
  handler: async function handler(request, h) {
    const params = request.params || {};
    let data;
    try {
      data = await dbapi.getRouteStops(params.route);
    } catch (e) {
      if (e === 'NODATA') {
        return h.response({ message: '404 Route not found' }).code(404);
      } else {
        return h.response('500 Internal Server Error').code(500);
      }
    }
    return h.response(data);
  }
});

server.route({
  method: 'GET',
  path:'/bus/stop/{stopId}',
  handler: async function handler(request, h) {
    const params = request.params || {};
    let data;
    try {
      data = await dbapi.getStopTimes(params.stopId);
    } catch (e) {
      if (e === 'NODATA') {
        return h.response({ message: '404 Stop not found' }).code(404);
      } else {
        return h.response('500 Internal Server Error').code(500);
      }
    }
    return h.response(data);
  }
});

server.route({
  method: 'GET',
  path:'/luas/stop/{stopId}',
  handler: async function handler(request, h) {
    const params = request.params || {};
    let data;
    try {
      data = await luas.getStopTimes(params.stopId);
    } catch (e) {
      return h.response('504 Gateway Timeout').code(504);
    }

    if (data) {
      return h.response(data);
    } else {
      return h.response('404 Not Found').code(404);
    }
  }
});

server.route({
  method: 'GET',
  path:'/luas/stops',
  handler: function handler(request, h) {
    const params = request.params || {};
    let data;
    try {
      data = luas.getStations(params.stopId);
    } catch (e) {
      return h.response('504 Gateway Timeout').code(504);
    }

    if (data) {
      return h.response(data);
    } else {
      return h.response('404 Not Found').code(404);
    }
  },
  config: {
    cache: {
      expiresIn: 60 * 60 * 1000,
      privacy: 'public'
    }
  }
});

const start = async function() {
  try {
      await server.register({
          plugin: require('hapi-cors')
      });

      await server.start();
      console.log('Server running at:', server.info.uri);
  } catch(err) {
      console.log(err);
      process.exit(1);
  }
};

start();

module.exports = server;
