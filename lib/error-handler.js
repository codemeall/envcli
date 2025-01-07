import chalk from 'chalk';

export class ErrorHandler {
  static handle(error, context = '') {
    if (error.name === 'FetchError') {
      console.error(chalk.red('Network Error:'), 'Unable to connect to the server');
    } else if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error(chalk.red('Authentication Error:'), 'Invalid credentials');
          break;
        case 403:
          console.error(chalk.red('Authorization Error:'), 'Access denied');
          break;
        case 429:
          console.error(chalk.red('Rate Limit Error:'), 'Too many attempts, please try again later');
          break;
        case 500:
          console.error(chalk.red('Server Error:'), 'Internal server error');
          break;
        default:
          console.error(chalk.red(`Error ${error.response.status}:`), error.message);
      }
    } else {
      console.error(chalk.red(`Error during ${context}:`), error.message);
    }
  }
} 