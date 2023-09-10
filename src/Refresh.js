import axios from 'axios';

const clientId = 'b48f3901523543fbbbf0f1e137a50712';
const clientSecret = '1a6f362c690c4f928ccf1bb00daaef0b';
const refreshToken = 'AQBisA1qWiEMhQ-emWmnyuADIFWgB6S06OdgpSMg1l2UJZWcs-cER6EL03zJUZBdlKJbqLSa12I2u-pSUCBpYR1KRZ7pGc1zddgOgBLq_skjfDXeNKxW1aNz1YvRuONal2E';
const tokenRefreshUrl = 'https://accounts.spotify.com/api/token';

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      tokenRefreshUrl,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }),
      {
        auth: {
          username: clientId,
          password: clientSecret
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const newAccessToken = response.data.access_token;
    console.log('Refreshed access token:', newAccessToken);
    return newAccessToken;
    // Use the newAccessToken for your API requests
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
};

// Refresh access token every hour (3600000 ms)
//setInterval(refreshAccessToken, 3600000);

export default refreshAccessToken;


