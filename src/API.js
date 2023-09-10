import express from 'express';
import queryString from 'query-string';
import request from 'request';
import axios from 'axios';

const app = express();
const PORT = 3000; // Set your desired port

const client_id = 'b48f3901523543fbbbf0f1e137a50712';
const client_secret = '1a6f362c690c4f928ccf1bb00daaef0b';
const redirect_uri = 'http://localhost:3000/callback';

let authToken;
let repeatAuthToken;


app.get('/callback', function(req, res) {
    const code = "AQB9AsoWv5dLGHferNL2hEGiEfsyioAeS7LzlKQm0SP6Vu6cu6Tx2Av8Jtz-LGKe1MAAXaMQoZHb0inh3ZZO7pA_6ku1NJAIqJypTRhBnidebARrhnRa1tTKfGA2XrUPTCO49OwsFntgRjKiIghDgi5TxFF68J4BPyM4X5uxkKdpSNwvIY1ak1PFO5CDINBIDyCGBBoGsZUE1g"
    var state = true;

    if (state === null) {
      res.redirect('/#' +
        queryString.stringify({
          error: 'state_mismatch'
        }));
    } else {
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirect_uri,
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true
      };

      // Make a POST request to exchange authorization code for access token
      request.post(authOptions, function(error, response, body) {
        console.log(response.statusCode);
        if (!error && response.statusCode === 200) {
          // Process the access token in 'body.access_token'
          console.log('Access token:', body.access_token);
          console.log('Refresh token:', body.refresh_token);
          console.log(body.scope);
          authToken = body.access_token;
          repeatAuthToken = body.refresh_token;
          res.redirect('/#' +
            queryString.stringify({
              access_token: body.access_token,
              refresh_token: body.refresh_token,
            })); 
        } else {
          res.redirect('/#' +
            queryString.stringify({
              error: 'invalid_token'
            }));
        }
      });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



/* app.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (code) {
    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: "http://localhost:3000/callback",
        }),
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const accessToken = response.data.access_token;
      // You can store the accessToken or use it for API requests
      
      res.send('Access token obtained!'); // Send a response to the client
    } catch (error) {
      console.error('Error exchanging code for access token:', error);
      res.status(500).send('Error obtaining access token');
    }
  } else {
    res.status(400).send('Missing authorization code');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); */

