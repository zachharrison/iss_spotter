const request = require('request');


// MAKES A SINGLE API REQUEST TO RETRIEVE THE USER'S IP
const fetchMyIp = (callback) => {
  const url = 'https://api.ipify.org?format=json';
  request(url, (err, res, body) => {
    // IF INVALID DOMAIN
    if (err) {
      return callback(err, null);
    }

    // IF NON 200 STATUS, ASSUME SERVER ERROR
    if (res.statusCode !== 200) {
      callback(Error(`Status Code ${res.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    // PARSE THE DATA
    const ip = JSON.parse(body).ip;
    callback(null, ip);

  });

};

const fetchCoordsByIp = (ip, callback) => {
  request(`http://ip-api.com/json/${ip}`, (err, res, body) => {

    // IF INVALID DOMAIN
    if (err) {
      callback(err, null);
      return;
    }
    // IF NON 200 STATUS, ASSUME SERVER ERROR
    if (res.statusCode !== 200 || JSON.parse(body).status === 'fail') {
      const msg = `Status code ${res.statusCode} when fetching coordinates for IP. Response: ${body}`;
      return callback(Error(msg), null);
    }

    // PARSE DATA FROM API AND ASSIGN VALUES TO OBJECT
    const latitude = JSON.parse(body).lat;
    const longitude = JSON.parse(body).lon;
    const geo = { latitude, longitude };

    callback(null, geo);

  });
};

// MAKE A REQUEST TO GET UPCOMING ISS FLY OVER TIMES WITH GIVEN LAT AND LONG
const fetchISSFlyOverTimes = (coords, callback) => {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (err, res, body) => {

    if (err) {
      console.log(err);
    }

    if (res.statusCode !== 200 || JSON.parse(body).status === 'fail') {
      const msg = `Status code ${res.statusCode} when fetching ISS pass times: ${body}`;
      return callback(Error(msg), null);
    }

    const data = JSON.parse(body);
    callback(null, data.response);

  });

};


const nextISSTimesForMyLocation = (callback) => {

  fetchMyIp((err, ip) => {
    if (err) {
      return callback(err, null);
    }
    
    fetchCoordsByIp(ip, (err, loc) => {
      if (err) {
        return callback(err, null);
      }

      fetchISSFlyOverTimes(loc, (err, nextPasses) => {
        if (err) {
          return callback(err, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };

