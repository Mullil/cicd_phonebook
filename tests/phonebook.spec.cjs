const { test, describe, expect } = require('@playwright/test')

describe('Puhelinluettelo', () => {
  test('front page can be opened', async ({ page }) => {
    await page.goto('')
    await expect(page.getByText('Phonebook')).toBeVisible()
    await expect(page.getByText('add a new')).toBeVisible()
  })
})