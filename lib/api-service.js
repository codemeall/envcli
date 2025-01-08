import fetch from 'node-fetch';
import chalk from 'chalk';

const API_BASE_URL = 'https://api.yourdomain.com'; // Replace with your API URL
const GET_USER_INFO = 'https://jsonplaceholder.typicode.com/users'

export class ApiService {

    static async getUserInfo(id) {
        try {
            const response = await fetch(`${GET_USER_INFO}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if(!response.ok) {
                throw new Error('Failed to fetch user info');
            }
            const data = await response.json();
            return {
                name: data.name,
                email: data.email,
                username: data.username,
            };
        } catch (error) {
            // console.error('Error fetching user info:', error);
            throw error;
        }
    }

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