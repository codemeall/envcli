#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { Config } from './lib/config.js';
import { requireLogin, validateCredentials } from './lib/auth.js';
import inquirer from 'inquirer';
import { ApiService } from './lib/api-service.js';


// Define __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const config = new Config();

// Initialize Commander
const program = new Command();

// Read package.json for version
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

// Set version
program.version(packageJson.version, '-v, --version', 'Display version number');

// Command to display version with more details
program
  .command('version')
  .description('Display detailed version information')
  .action(() => {
    console.log(chalk.blue(
      figlet.textSync('EnvCLI', { horizontalLayout: 'full' })
    ));
    console.log(chalk.green(`Version: ${packageJson.version}`));
    console.log(chalk.yellow('Author:', packageJson.author || 'Not specified'));
    console.log(chalk.yellow('License:', packageJson.license));
    console.log(chalk.yellow('Node version:', process.version));
  });

// Utility function to parse the value based on type
function parseValue(value, type) {
  switch (type.toLowerCase()) {
    case 'boolean':
      return value.toLowerCase() === 'true';
    case 'number':
      return parseFloat(value);
    case 'array':
      return value.split(',').map((item) => item.trim());
    case 'string':
    default:
      return value;
  }
}

// Command to display tool info
program
  .command('about')
  .description('Display CLI tool information')
  .action(() => {
    console.log(
      chalk.blue(
        figlet.textSync('EnvCLI', { horizontalLayout: 'full' })
      )
    );
    console.log(chalk.green('A CLI tool for managing environment variables.'));
    // center align the version
    console.log(chalk.yellow('Version: 1.0.1'));
  });


  // Login command
program
.command('login')
.description('Login to EnvCLI')
.action(async () => {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'username',
        message: 'Enter your username:',
        validate: (input) => {
          if (!input) {
            return 'Username cannot be empty';
          }
          return true;
        }
      },
      {
        type: 'password',
        name: 'key',
        message: 'Enter your login key:',
        mask: '*',
        validate: (input) => {
          if (!input) {
            return 'Login key cannot be empty';
          }
          return true;
        }
      }
    ]);

    console.log(chalk.yellow('Verifying credentials...'));

    try {
      const result = await ApiService.verifyLogin(answers.username, answers.key);
      
      // For demo purposes, still check local credentials if API is not available
      if (result.success) {
        config.login(answers.username);
        if (result.token) {
          config.saveToken(result.token); // Add this method to your Config class
        }
        console.log(chalk.green('✨ Successfully logged in!'));
      }
    } catch (apiError) {
      console.log(chalk.yellow('⚠️  API verification failed, falling back to local verification...'));
      
      // Fallback to local verification
      if (validateCredentials(answers.username, answers.key)) {
        config.login(answers.username);
        console.log(chalk.green('✨ Successfully logged in (local verification)!'));
      } else {
        console.log(chalk.red('❌ Invalid credentials'));
        process.exit(1);
      }
    }
  } catch (error) {
    console.error(chalk.red('Error during login:'), error.message);
    process.exit(1);
  }
});

program
.command('user')
.description('Get user info')
.action(requireLogin(async () => {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Enter your user ID:',
      }
    ]);
    const userInfo = await ApiService.getUserInfo(answers.id);
    console.log(chalk.yellow('User Info:'), userInfo);
  } catch (error) {
    console.error(chalk.red('Error fetching user info:'), error.message);
    process.exit(1);
  }
}));

// Logout command
program
.command('logout')
.description('Logout from EnvCLI')
.action(requireLogin(() => {
  config.logout();
  console.log(chalk.green('👋 Successfully logged out!'));
}));

// Status command
program
.command('status')
.description('Check login status')
.action(() => {
  if (config.isLoggedIn()) {
    console.log(chalk.green(`✨ Logged in as: ${config.getUsername()}`));
  } else {
    console.log(chalk.yellow('❌ Not logged in'));
  }
});

// Command to list environment variables
program
  .command('list')
  .description('List all environment variables')
  .action(requireLogin(() => {
    const envFile = path.join(__dirname, '.env.json');
    if (fs.existsSync(envFile)) {
      const envData = JSON.parse(fs.readFileSync(envFile, 'utf-8'));
      console.log(chalk.yellow('Environment Variables:'));
      
      // Transform data into table format with key, value and type
      const tableData = Object.entries(envData).map(([key, value]) => ({
        Key: key,
        Value: JSON.stringify(value),
        Type: Array.isArray(value) ? 'array' : typeof value
      }));
      
      console.table(tableData);
    } else {
      console.log(chalk.red('No .env.json file found!'));
    }
  }));

// Command to set or update environment variables with type
program
  .command('set <key> <value> [type]')
  .description(
    'Set or update an environment variable. Optionally specify the type (boolean, number, array, string, object). Default is string.'
  )
  .action(requireLogin((key, value, type = 'string') => {
    const envFile = path.join(__dirname, '.env.json');
    let envData = {};

    if (fs.existsSync(envFile)) {
      envData = JSON.parse(fs.readFileSync(envFile, 'utf-8'));
    }

    let parsedValue;
    try {
      switch (type.toLowerCase()) {
        case 'boolean':
          parsedValue = value.toLowerCase() === 'true';
          break;
        case 'number':
          parsedValue = Number(value);
          if (isNaN(parsedValue)) {
            throw new Error('Invalid number format');
          }
          break;
        case 'array':
          try {
            // First try to parse as JSON array
            parsedValue = JSON.parse(value);
            if (!Array.isArray(parsedValue)) {
              // If not array, try comma-separated format
              parsedValue = value.split(',').map(item => item.trim());
            }
          } catch {
            // If JSON parse fails, use comma-separated format
            parsedValue = value.split(',').map(item => item.trim());
          }
          break;
        case 'object':
          try {
            parsedValue = JSON.parse(value);
            if (typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
              throw new Error('Invalid object format');
            }
          } catch {
            throw new Error('Invalid JSON object format');
          }
          break;
        case 'string':
        default:
          parsedValue = value;
      }

      envData[key] = parsedValue;
      fs.writeFileSync(envFile, JSON.stringify(envData, null, 2));
      console.log(
        chalk.green(`Set ${key}=${JSON.stringify(parsedValue)} (type: ${type || 'string'})`)
      );
    } catch (error) {
      console.log(chalk.red(`Error setting value: ${error.message}`));
      process.exit(1);
    }
  }));


// Command to delete an environment variable
program
  .command('delete <key>')
  .description('Delete an environment variable')
  .action(requireLogin((key) => {
    const envFile = path.join(__dirname, '.env.json');
    if (fs.existsSync(envFile)) {
      let envData = JSON.parse(fs.readFileSync(envFile, 'utf-8'));
      if (key in envData) {
        delete envData[key];
        fs.writeFileSync(envFile, JSON.stringify(envData, null, 2));
        console.log(chalk.green(`Deleted variable: ${key}`));
      } else {
        console.log(chalk.red(`Variable ${key} does not exist.`));
      }
    } else {
      console.log(chalk.red('No .env.json file found!'));
    }
  }));

// Command to check for updates
program
  .command('update')
  .description('Check for and install updates')
  .action(() => {
    try {
      console.log(chalk.yellow('Checking for updates...'));
      
      // Run brew update
      execSync('brew update', { stdio: 'inherit' });
      
      // Check if update is available and upgrade in one command
      try {
        const outdated = execSync('brew outdated envcli').toString();
        if (outdated.includes('envcli')) {
          console.log(chalk.yellow('Update available! Installing...'));
          execSync('brew upgrade envcli', { stdio: 'inherit' });
          console.log(chalk.green('✨ Successfully updated envcli!'));
        } else {
          console.log(chalk.green('✨ You are already using the latest version!'));
        }
      } catch (outdatedError) {
        // If brew outdated returns non-zero exit code (meaning updates available), upgrade anyway
        console.log(chalk.yellow('Update available! Installing...'));
        execSync('brew upgrade envcli', { stdio: 'inherit' });
        console.log(chalk.green('✨ Successfully updated envcli!'));
      }
    } catch (error) {
      console.error(chalk.red('Error during update:'), error.message);
      process.exit(1);
    }
  });

// Add explicit exit handling
program
  .exitOverride((err) => {
    if (err.code === 'commander.help' || err.code === 'commander.helpDisplayed') {
      process.exit(0);
    }
    process.exit(1);
  });

// Parse arguments
program.parse(process.argv);

// If no commands were passed, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(0);
}
