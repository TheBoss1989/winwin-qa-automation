const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');

test.describe('WinWin.travel required QA automation scenarios', () => {
  test('Max Adults Selection: user can select max adults and plus becomes disabled at the limit', async ({ page }) => {
    const home = new HomePage(page);

    await home.openApp();
    await home.openGuests();

    const result = await home.increaseAdultsUntilLimit();

    expect(result.count, 'Adults counter should stop at the current product limit').toBe(10);
    expect(result.plusDisabled, 'Adults plus control should be disabled at the limit').toBe(true);
  });

  test('Pets Filter Options: pet type and dog weight options are selectable and visible', async ({ page }) => {
    const home = new HomePage(page);

    await home.openApp();
    await home.openGuests();
    await home.addOnePet();

    await home.openPetTypeDropdown();
    await expect(page.getByRole('option', { name: 'Dog' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Cat' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Other' })).toBeVisible();
    await page.getByRole('option', { name: 'Other' }).click();
    await expect(page.locator('[data-wwt-id="guests-select__pet-type--select"]')).toContainText('Other');

    await home.openPetTypeDropdown();
    await page.getByRole('option', { name: 'Dog' }).click();
    await expect(page.locator('[data-wwt-id="guests-select__pet-type--select"]')).toContainText('Dog');

    await home.openPetWeightDropdown();
    for (const option of ['<1 kg', '1-5 kg', '5-10 kg', '15-20 kg', '>20 kg']) {
      await expect(page.getByRole('option', { name: option })).toBeVisible();
    }

    await page.getByRole('option', { name: '>20 kg' }).click();
    await expect(page.locator('[data-wwt-id="guests-select__pet-weight--select"]')).toContainText('>20 kg');
  });

  test('Filters Affect Request: applying filters changes URL and search API request parameters', async ({ page }) => {
    const home = new HomePage(page);
    const searchRequests = [];

    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('/api/v1/offers/search')) {
        searchRequests.push(url);
      }
    });

    await home.openApp();
    const initialUrl = page.url();

    await home.openFilters();
    await home.selectFilterOptionByLabel('Dogs allowed');
    await home.applySearchIfAvailable();
    await page.waitForLoadState('networkidle');

    const finalUrl = page.url();
    const finalSearchRequest = searchRequests.at(-1) || '';

    expect(finalUrl, 'URL should reflect applied filters').not.toBe(initialUrl);
    expect(
      decodeURIComponent(finalSearchRequest),
      'Search API request should include applied filter information'
    ).toMatch(/dog|pet|filter/i);
  });
});
