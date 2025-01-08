# EnvCLI

A command-line interface tool for managing environment variables through a JSON file.

![EnvCLI Banner](path/to/banner.png)

---

# 🛠 Developer Guide

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/envcli.git
   cd envcli
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Make the CLI executable:
   ```bash
   chmod +x index.js
   ```

4. Link the package locally:
   ```bash
   npm link
   ```

## Development Workflow

1. Main source files are in `src/`
2. Run tests using:
   ```bash
   npm test
   ```
3. For local testing, use:
   ```bash
   ./index.js <command>
   ```

## Building and Publishing

1. Update version in `package.json`
2. Create a package:
   ```bash
   npm pack
   ```
3. Publish to npm:
   ```bash
   npm login
   npm publish
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

# 📘 User Guide

## Installation

Install EnvCLI globally using npm:

```bash
npm install -g envcli
```

## Features

- 🚀 Easy environment variable management
- 🎯 Type support (string, boolean, number, array)
- 📝 JSON-based storage
- 🎨 Colorful terminal output
- 🔄 Simple CRUD operations

## Usage

### Set Environment Variables
```bash
envcli set <key> <value> [--type=string|boolean|number|array]
```

Example:
```bash
envcli set API_URL https://api.example.com
envcli set DEBUG true --type=boolean
envcli set PORT 3000 --type=number
envcli set ALLOWED_HOSTS localhost,127.0.0.1 --type=array
```

### Get Environment Variables
```bash
envcli get <key>
```

### List All Environment Variables
```bash
envcli list
```

### Delete Environment Variables
```bash
envcli delete <key>
```

## Storage

Environment variables are stored in a `.env.json` file in your project directory:

```json
{
  "API_URL": "https://api.example.com",
  "PORT": 3000,
  "DEBUG": true,
  "ALLOWED_HOSTS": ["localhost", "127.0.0.1"]
}
```

## Support

- GitHub Issues: [Report a bug](https://github.com/yourusername/envcli/issues)
- Documentation: [Wiki](https://github.com/yourusername/envcli/wiki)

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)
- npm: [@yourusername](https://www.npmjs.com/~yourusername)

## Acknowledgments

- [Commander.js](https://github.com/tj/commander.js)
- [Chalk](https://github.com/chalk/chalk)
- [Figlet](https://github.com/patorjk/figlet.js)