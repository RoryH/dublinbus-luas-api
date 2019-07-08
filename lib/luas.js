'use strict';
const axios = require('axios');
const parseXml = require('util').promisify(require('xml2js').parseString);
const path = require('path');

module.exports = (function() {
  const apiUrl = 'https://luasforecasts.rpa.ie/xml/get.ashx';

  function _getApiReponse(qs) {
    return axios.get(
        apiUrl,
        { params: qs },
    )
      .then((response) => parseXml(response.data, { mergeAttrs: true, explicitArray: false }))
      .then(xml => xml.stopInfo);
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