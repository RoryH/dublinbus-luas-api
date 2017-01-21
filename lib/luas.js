'use strict';
const request = require('request');
const parseXml = require('xml2js').parseString;
const path = require('path');

module.exports = (function() {
  const apiUrl = 'https://luasforecasts.rpa.ie/xml/get.ashx';

  function _getApiReponse(qs) {
    return new Promise(function(resolve, reject) {
      request({
        uri: apiUrl,
        qs: qs
      }, function (error, response, body) {
        if (error || response.statusCode !== 200) {
          reject(`REQUEST_ERROR: ${error || response.statusCode}`);
        } else {
          parseXml(body, { mergeAttrs: true, explicitArray: false }, function(err, result) {
            if (err) {
              reject('XML_PARSE_ERROR');
            } else {
              resolve(result.stopInfo);
            }
          });
        }
      });
    });
  }

  return {
    getStopTimes: function(stop) {
      const qs = {
        stop: stop,
        action: 'forecast',
        encrypt: false
      };

      return _getApiReponse(qs);
    },

    getStations: function() {
      return require(path.join(__dirname, 'luas_stations.json'));
    }
  };
})();