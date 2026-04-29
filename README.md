# WinWin.travel QA Automation

Automation submission for the QA Automation Engineer test task.

## Stack
- Playwright
- JavaScript
- Page Object Model (POM)

---

## Covered Scenarios

### 1. Max Adults Selection
- Opens Guests selector
- Increases adults up to UI limit
- Verifies max value = 10
- Verifies "+" button is disabled at limit

### 2. Pets Filter Options
- Adds one pet
- Verifies pet types: Dog, Cat, Other
- Switches between options
- Verifies dog weight filters:
  `<1 kg`, `1–5 kg`, `5–10 kg`, `15–20 kg`, `>20 kg`
- Validates selected state in UI

### 3. Filters Affect Request
- Applies filters (Dogs allowed)
- Verifies URL changes
- Verifies `/api/v1/offers/search` request contains filters

---

## Installation

```bash
npm install
npx playwright install
```

---

## Run tests

```bash
npm test
```

Run in headed mode:

```bash
npm run test:headed
```

View report:

```bash
npm run report
```

---

## Notes

- Default base URL: https://winwin.travel
- Can be overridden:

```bash
BASE_URL=https://winwin.travel npm test
```

- ⚠️ The "Filters Affect Request" test may fail:
  - URL does not always update after applying filters
  - API request may not reflect selected filters

This behavior was observed during exploratory testing and documented as a bug.

---

## Latest Test Run

- ✅ Max Adults Selection — Passed
- ✅ Pets Filter Options — Passed
- ❌ Filters Affect Request — Failed

Reason:
URL did not change after applying filters, indicating a potential issue with filter-to-request synchronization.
