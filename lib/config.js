import fs from 'fs';
import os from 'os';
import path from 'path';

const CONFIG_DIR = path.join(os.homedir(), '.envcli');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export class Config {
  constructor() {
    this.ensureConfigExists();
    this.config = this.loadConfig();
  }

  ensureConfigExists() {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR);
    }
    if (!fs.existsSync(CONFIG_FILE)) {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify({ isLoggedIn: false, username: null }));
    }
  }

  loadConfig() {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  }

  saveConfig() {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2));
  }

  isLoggedIn() {
    return this.config.isLoggedIn;
  }

  getUsername() {
    return this.config.username;
  }

  login(username) {
    this.config.isLoggedIn = true;
    this.config.username = username;
    this.saveConfig();
  }

  logout() {
    this.config.isLoggedIn = false;
    this.config.username = null;
    this.saveConfig();
  }
} 