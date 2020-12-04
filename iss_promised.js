const request = require('request-promise-native');

// FETCH IP ADDRESS
const fetchMyIp = () => request('https://api.ipify.org?format=json');

// FETCH COORDS
const fetchCoordsByIp = (data) => {
  const ip = JSON.parse(data).ip;
  return request(`http://ip-api.com/json/${ip}`);
};

// FETCH FLY OVER TIMES
const fetchISSFlyOverTime = (body) => {
  const latitude = JSON.parse(body).lat;
  const longitude = JSON.parse(body).lon;
  const url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`;
  return request(url);
};

// FETCH TIMES FOR MY LOCATION
const nextISSTimesForMyLocation = () => {
  return fetchMyIp()
    .then(fetchCoordsByIp)
    .then(fetchISSFlyOverTime)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
}

module.exports = { nextISSTimesForMyLocation };





