## Getting Started | Setup Instructions

To set up your environment for local development, make sure Node and all its
dependencies are installed, as well as the two testing suites.

Note, this project is using an RC candidate of react 19

```bash
npm install --legacy-peer-deps
 npx playwright install
```

In order to run the tests, it is critical that the development server is up
first:

```bash
npm run dev & npx wait-on http://localhost:3000
```

You may view and interact with the application at
[http://localhost:3000](http://localhost:3000) on your browser. To run the test
suites separately:

```bash
npm run test # This command runs the Vite unit tests, specified in package.json.
npx playwriight test
```
