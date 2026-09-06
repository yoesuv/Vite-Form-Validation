# Form Validation Demo

[![codecov](https://codecov.io/gh/yoesuv/Vite-Form-Validation/graph/badge.svg?token=AIG4IZ0ME5)](https://codecov.io/gh/yoesuv/Vite-Form-Validation)
[![](https://github.com/yoesuv/Vite-Form-Validation/actions/workflows/github-actions.yml/badge.svg)](https://github.com/yoesuv/Vite-Form-Validation/actions)

A simple Vite app with login and registration forms. It includes inline validation, password visibility controls, and responsive styling.

This is a frontend demo only. It does not create accounts, verify credentials, or connect to a backend. Successful form submissions are logged to the browser console.

## Validation

- Email is required and must be valid.
- Passwords must be at least 8 characters.
- Names must be 2 to 250 characters and cannot contain emoticons.
- Registration passwords must match.

## Run Locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal, usually `http://localhost:5173`.

## Commands

| Command                  | Description                  |
| ------------------------ | ---------------------------- |
| `npm run dev`            | Start the development server |
| `npm run build`          | Create a production build    |
| `npm run preview`        | Preview the production build |
| `npm run lint`           | Check the code with ESLint   |
| `npm test`               | Run the tests                |
| `npm run test:watch`     | Run tests in watch mode      |
| `npm test -- --coverage` | Run tests with coverage      |

## Routes

- `/login` - Login form
- `/register` - Registration form
- `/` - Redirects to `/login`

## Built With

React, TypeScript, Vite, React Router, Zod, Tailwind CSS, Vitest, and Testing Library.

Validation schemas are in `src/lib/validation.ts`. Tests are in `test/`.
