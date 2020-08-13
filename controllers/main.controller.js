const qs = require('querystring');
const axios = require('axios');
require('dotenv').config();

exports.login = async function() {
    const data = JSON.stringify({"user":  process.env.LOGIN, "password": process.env.PASSWORD});

    const config = {
      method: 'post',
      url: `${process.env.API_HOST}:${process.env.API_PORT}/login`,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Basic ${process.env.ENCODEDAUTH}`
      },
      data : data
    };

    const res = await axios(config);
    return res;
}

exports.getAccessToken = async function(refresh_token) {

    const requestBody = {
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
    }

    const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    const response = await axios.post(`${process.env.API_HOST}:${process.env.API_PORT}/token`, qs.stringify(requestBody), config)
    return response;
}

exports.getRecursiveData = async function(access_token, url) {
    const config = {
        method: 'get',
        url: url,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${access_token}`
        },
      };

    const response = await axios(config);
    return response;
}
