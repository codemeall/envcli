#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

// Define __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    console.log(chalk.yellow('Version: 1.0.5'));
  });

// Command to list environment variables
program
  .command('list')
  .description('List all environment variables')
  .action(() => {
    const envFile = path.join(__dirname, '.env.json');
    if (fs.existsSync(envFile)) {
      const envData = JSON.parse(fs.readFileSync(envFile, 'utf-8'));
      console.log(chalk.yellow('Environment Variables:'));
      console.table(envData);
    } else {
      console.log(chalk.red('No .env.json file found!'));
    }
  });

// Command to set or update environment variables with type
program
  .command('set <key> <value> [type]')
  .description(
    'Set or update an environment variable. Optionally specify the type (boolean, number, array, string). Default is string.'
  )
  .action((key, value, type = 'string') => {
    const envFile = path.join(__dirname, '.env.json');
    let envData = {};

    if (fs.existsSync(envFile)) {
      envData = JSON.parse(fs.readFileSync(envFile, 'utf-8'));
    }

    const parsedValue = parseValue(value, type || 'string');
    envData[key] = parsedValue;

    fs.writeFileSync(envFile, JSON.stringify(envData, null, 2));
    console.log(
      chalk.green(`Set ${key}=${JSON.stringify(parsedValue)} (type: ${type || 'string'})`)
    );
  });


// Command to delete an environment variable
program
  .command('delete <key>')
  .description('Delete an environment variable')
  .action((key) => {
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
  });

// Command to check for updates
program
  .command('update')
  .description('Check for and install updates')
  .action(() => {
    try {
      console.log(chalk.yellow('Checking for updates...'));
      
      // Run brew update
      execSync('brew update', { stdio: 'inherit' });
      
      // Check if update is available
      const outdated = execSync('brew outdated envcli').toString();
      
      if (outdated.includes('envcli')) {
        console.log(chalk.yellow('Update available! Installing...'));
        execSync('brew upgrade envcli', { stdio: 'inherit' });
        console.log(chalk.green('✨ Successfully updated envcli!'));
      } else {
        console.log(chalk.green('✨ You are already using the latest version!'));
      }
    } catch (error) {
      console.error(chalk.red('Error checking for updates:'), error.message);
      process.exit(1);
    }
  });

// Parse arguments
program.parse(process.argv);
