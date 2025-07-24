import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3003',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3003/',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: 'html',
})

