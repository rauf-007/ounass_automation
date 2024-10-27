// @ts-check
const { defineConfig, devices } = require('@playwright/test');
import dotenv from "dotenv"
import 'dotenv/config'


/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();


dotenv.config({
  path: `./env/.env.${process.env.ENV}`,
})


/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // globalSetup: require.resolve("./config/global-setup"),
  testDir: './tests',
  timeout:50000,

  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  // retries:1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter:
    // [['./customreporter.js']

    [['html'],
            ['allure-playwright', {outputFolder: 'my-allure-results'} ]
          ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  // Add Argos reporter only when it runs on CI
  // reporter: process.env.CI
  //   ? [["list"], ["@argos-ci/playwright/reporter"]]
  //   : "list",

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
      viewport: {width: 1536, height: 750}, //864
    },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    {
      name: 'Mobile Chrome',
      use: { ...devices['iPad'] },
    },


    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});




