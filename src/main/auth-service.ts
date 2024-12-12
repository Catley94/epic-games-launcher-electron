const axios = require('axios');
const { BrowserWindow } = require('electron');
const Store = require('electron-store');

const store = new Store();

const AUTH_URL = 'https://www.epicgames.com/id/authorize';
const TOKEN_URL = 'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token';
const REDIRECT_URI = 'http://localhost/callback';
const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';

class AuthService {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async getAuthorizationCode() {
    return new Promise((resolve, reject) => {
      const authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
      });

      const authUrl = `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`;

      authWindow.loadURL(authUrl);
      authWindow.show();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      authWindow.webContents.on('will-navigate', (event, url) => {
        const code = new URL(url).searchParams.get('code');
        if (code) {
          resolve(code);
          authWindow.close();
        }
      });

      authWindow.on('closed', () => {
        reject(new Error('Auth window was closed'));
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async getTokens(code) {
    const data = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
    });

    const response = await axios.post(TOKEN_URL, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    });

    return response.data;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async authenticate() {
    try {
      const code = await this.getAuthorizationCode();
      const tokens = await this.getTokens(code);
      store.set('tokens', tokens);
      return tokens;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getStoredTokens() {
    return store.get('tokens');
  }
}

module.exports = new AuthService();
