'use strict';

module.exports = (function() {
  const soap = require('soap');
  const inspect = require('util').inspect;
  const url = 'http://rtpi.dublinbus.ie/DublinBusRTPIService.asmx?WSDL';
  const initedPromise = new Promise(function(resolve, reject) {
    soap.createClient(url, function(err, client) {
      if (err) {
        reject(err);
      } else {
        resolve(client);
      }
    });
  });

  return {
    getRouteStops: function(route) {
      return new Promise(function(resolve, reject) {
        initedPromise.then(
          function(client) {
            const args = { 'route': route };
            client.GetStopDataByRoute(args, function(err, result) {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          },
          function(e) {
            console.error(inspect(e));
          }
        );
      });
    },
    getStopTimes: function(stopId) {
      return new Promise(function(resolve, reject) {
        initedPromise.then(
          function(client) {
            const args = { 'stopId': stopId, 'forceRefresh': '1' };
            client.GetRealTimeStopData(args, function(err, result) {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          },
          function(e) {
            console.error(inspect(e));
          }
        );
      });
    }
  };

}());