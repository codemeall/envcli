import { Config } from './config.js';
import chalk from 'chalk';

export function requireLogin(action) {
  return (...args) => {
    const config = new Config();
    if (!config.isLoggedIn()) {
      console.log(chalk.red('⚠️  You must be logged in to use this command.'));
      console.log(chalk.yellow('Please login using: envcli login'));
      process.exit(1);
    }
    return action(...args);
  };
}

export function validateCredentials(username, key) {
  // Demo credentials
  const DEMO_USERNAME = 'root';
  const DEMO_KEY = '123456';
  
  return username === DEMO_USERNAME && key === DEMO_KEY;
} 