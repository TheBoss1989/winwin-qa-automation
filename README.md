# WinWin.travel QA Automation

Automation submission for the QA Automation Engineer section of the test task.

## Stack

- Playwright
- JavaScript
- Page Object Model

## Covered Scenarios

1. Max Adults Selection
   - Opens the Guests selector.
   - Increases adults until the current UI limit.
   - Verifies the maximum value is `10`.
   - Verifies the plus button is disabled at the limit.

2. Pets Filter Options
   - Adds one pet.
   - Verifies pet type options: `Dog`, `Cat`, `Other`.
   - Selects `Other`, then switches back to `Dog`.
   - Verifies dog weight options: `<1 kg`, `1-5 kg`, `5-10 kg`, `15-20 kg`, `>20 kg`.
   - Selects `>20 kg` and verifies selected UI state.

3. Filters Affect Request
   - Opens the filters panel.
   - Selects `Dogs allowed`.
   - Applies search.
   - Verifies the URL changes.
   - Verifies the latest `/api/v1/offers/search` request contains filter-related parameters.

## Setup

```bash
npm install
npx playwright install
```

## Run

```bash
npm test
```

Run headed:

```bash
npm run test:headed
```

Show HTML report:

```bash
npm run report
```

## Notes

- Default base URL is `https://winwin.travel`.
- You can override it:

```bash
BASE_URL=https://winwin.travel npm test
```

- The third scenario is intentionally strict. During exploratory testing, quick/filter interactions did not consistently update the URL or trigger a new search request, so this test may fail until the product behavior is fixed or clarified.

## Latest Local Run

Command:

```bash
npm test
```

Result on 27 Apr 2026:

- Passed: `Max Adults Selection`
- Passed: `Pets Filter Options`
- Failed: `Filters Affect Request`

Failure reason:

```text
URL should reflect applied filters
Expected final URL to differ from initial URL after selecting Dogs allowed and applying filters.
Actual final URL stayed unchanged.
```

This failure confirms the filter/request synchronization issue documented in the QA report.
