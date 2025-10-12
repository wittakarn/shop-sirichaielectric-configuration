# Sirichai Electric Configuration

A React-based configuration management system for Sirichai Electric shop.

## Project Overview

This project is a TypeScript React application built with Material-UI that provides configuration management capabilities for an electric shop system.

## Tech Stack

- **React** 18.2.0
- **TypeScript** 4.2.4
- **Material-UI** 5.15.0
- **Redux** with Redux Thunk for state management
- **React Router** 5.2.0 for navigation
- **Formik** for form management
- **Webpack** 5 for bundling
- **Styled Components** and Emotion for styling

## Prerequisites

- Node.js >= 20.0.0 < 21.0.0
- npm >= 10.0.0 < 11.0.0

## Installation

```bash
npm install
```

## Available Scripts

### `npm run dev`

Builds the app in development mode with webpack.

### `npm run build`

Builds the app for production using the webpack configuration.

### `npm run deploy`

Builds the app in production mode optimized for deployment.

## Project Structure

This project uses a custom webpack configuration instead of Create React App's default setup. The webpack config handles TypeScript compilation and bundling.

## Configuration

PHP configuration is managed in [config.php](config.php) which defines:
- Application paths and URLs
- Session management
- Cookie settings
- VAT rates
- Integration with the main electric shop at electricth.com

## Repository

- **GitHub**: [wittakarn/sirichaielectric-configuration](https://github.com/wittakarn/sirichaielectric-configuration)
- **Issues**: [Report issues here](https://github.com/wittakarn/sirichaielectric-configuration/issues)

## License

ISC
