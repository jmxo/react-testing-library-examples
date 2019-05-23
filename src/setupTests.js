// https://facebook.github.io/create-react-app/docs/running-tests#initializing-test-environment

// CRA doesn't allow using jest.config.js with a setupTestFrameworkScriptFile, but if it finds a src/setupTests.js file it will be automatically executed before running the tests
import 'jest-dom/extend-expect'
import 'react-testing-library/cleanup-after-each'
