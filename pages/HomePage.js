const { expect } = require('@playwright/test');

class HomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.guestOpenButton = page.locator('[data-wwt-id="guests-select__open--button"]').filter({ visible: true }).first();
    this.counterInputs = page.locator('[data-wwt-id="number-counter__input--input"]');
    this.counterPlusButtons = page.locator('[data-wwt-id="number-counter__plus--button"]');
    this.filterButton = page.locator('[data-wwt-id="main-search__big-filter-open--button"]').filter({ visible: true }).first();
  }

  async openApp() {
    await this.page.goto('/app', { waitUntil: 'networkidle' });
    await this.closeCookieToastIfVisible();
  }

  async closeCookieToastIfVisible() {
    const closeButton = this.page.getByRole('button', { name: /close/i }).first();
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
    }
  }

  async openGuests() {
    await expect(this.guestOpenButton).toBeVisible();
    await this.guestOpenButton.click();
    await expect(this.counterInputs.first()).toBeVisible();
  }

  async getAdultCount() {
    return Number(await this.counterInputs.nth(0).inputValue());
  }

  async getChildrenCount() {
    return Number(await this.counterInputs.nth(1).inputValue());
  }

  async getPetCount() {
    return Number(await this.counterInputs.nth(2).inputValue());
  }

  async increaseAdultsUntilLimit(maxClicks = 30) {
    const adultPlusButton = this.counterPlusButtons.nth(0);
    let previousCount = await this.getAdultCount();

    for (let i = 0; i < maxClicks; i += 1) {
      if (await adultPlusButton.isDisabled()) {
        break;
      }

      await adultPlusButton.click();
      await this.page.waitForTimeout(100);

      const currentCount = await this.getAdultCount();
      if (currentCount === previousCount) {
        break;
      }
      previousCount = currentCount;
    }

    return {
      count: await this.getAdultCount(),
      plusDisabled: await adultPlusButton.isDisabled()
    };
  }

  async addOnePet() {
    await this.counterPlusButtons.nth(2).click();
    await expect(this.counterInputs.nth(2)).toHaveValue('1');
  }

  async openPetTypeDropdown() {
    await this.page.locator('[data-wwt-id="guests-select__pet-type--select"]').click();
  }

  async openPetWeightDropdown() {
    await this.page.locator('[data-wwt-id="guests-select__pet-weight--select"]').click();
  }

  async getVisibleOptionTexts() {
    return this.page
      .locator('[role="option"], [data-radix-collection-item], [cmdk-item], [data-highlighted]')
      .evaluateAll((nodes) =>
        nodes
          .map((node) => node.textContent?.trim().replace(/\s+/g, ' '))
          .filter(Boolean)
      );
  }

  async openFilters() {
    await this.filterButton.click();
    await expect(this.page.getByRole('dialog', { name: 'Filters' })).toBeVisible();
  }

  async selectFilterOptionByLabel(label) {
    const optionLabel = this.page.getByText(label, { exact: true }).last();
    await optionLabel.scrollIntoViewIfNeeded();
    await optionLabel.click();
  }

  async applySearchIfAvailable() {
    const dialogApplyButton = this.page.getByRole('button', { name: /Apply/i }).last();
    if (await dialogApplyButton.isVisible().catch(() => false)) {
      await dialogApplyButton.scrollIntoViewIfNeeded();
      await dialogApplyButton.click();
      return;
    }

    const searchButton = this.page.locator('[data-wwt-id="main-search__apply-button--unique"]').filter({ visible: true }).first();
    if (await searchButton.isVisible().catch(() => false)) {
      await searchButton.click();
    }
  }
}

module.exports = { HomePage };
