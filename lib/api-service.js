import fetch from 'node-fetch';
import chalk from 'chalk';

const API_BASE_URL = 'https://api.yourdomain.com'; // Replace with your API URL

export class ApiService {
  static async verifyLogin(username, key) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password: key
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Authentication failed');
      }

      const data = await response.json();
      return {
        success: true,
        token: data.token, // If your API returns a token
        user: data.user
      };
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Unable to connect to authentication server');
      }
      throw error;
    }
  }
} 