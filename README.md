# EnvCLI

A command-line interface tool for managing environment variables through a JSON file.

![EnvCLI Banner](path/to/banner.png) <!-- You can add a banner image if you want -->

## Features

- 🚀 Easy environment variable management
- 🎯 Type support (string, boolean, number, array)
- 📝 JSON-based storage
- 🎨 Colorful terminal output
- 🔄 Simple CRUD operations

## Installation

### Global Installation (after publishing) 

### Local Development Installation

Clone the repository and install dependencies: 

The following types are supported:
- `string` (default)
- `boolean`
- `number`
- `array` (comma-separated values)

Examples: 
```

### Delete Environment Variables
```bash
envcli delete <key>
```

Example:
```bash
envcli delete API_URL
```

## Storage

Environment variables are stored in a `.env.json` file in the same directory as the CLI tool. The file is automatically created when you set your first variable.

Example `.env.json`:
```json
{
  "API_URL": "https://api.example.com",
  "PORT": 3000,
  "DEBUG": true,
  "ALLOWED_HOSTS": ["localhost", "127.0.0.1"]
}
```

## Local Development

1. Clone the repository
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

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

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