This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Clinical Trials API Tester

This application serves as a testing and exploration environment for the official [ClinicalTrials.gov API (v2)](https://clinicaltrials.gov/data-api/api). It provides a user-friendly interface to construct requests, send them to the live API, and view the responses.

### Key Features:

*   **Interactive Endpoint Explorer:**
    *   Select from a pre-configured list of key ClinicalTrials.gov API v2 endpoints:
        *   `Search Studies (/api/v2/studies)`
        *   `Single Study by NCT ID (/api/v2/studies/{nctId})`
        *   `Data Model Fields (/api/v2/studies/metadata)`
        *   `Search Areas (/api/v2/studies/search-areas)`
        *   `Available Enumerations (/api/v2/studies/enums)`
    *   Each endpoint is presented in an accordion view for easy navigation.
*   **Dynamic Parameter Forms:**
    *   Input forms are automatically generated based on the parameters defined for each selected endpoint (configured in `src/lib/apiConfigs.ts`).
    *   Supports various input types: text fields, text areas, number inputs, checkboxes, and select dropdowns.
*   **Live Enumeration Fetching:**
    *   For parameters requiring specific values (e.g., study phase, status), the application fetches the latest valid options directly from the `/api/v2/studies/enums` endpoint. These are then used to populate dropdowns or checkbox groups, ensuring valid inputs.
*   **Request Execution & Visualization:**
    *   Construct and send GET requests to the live ClinicalTrials.gov API.
    *   View the raw JSON responses from the API directly within the application.
*   **Comprehensive Error Display:**
    *   Clear display of any errors returned by the API or encountered during the request lifecycle, including request URL and parameters.
*   **Total Results Count:**
    *   For the "Search Studies" endpoint, the total number of matching records is displayed when the `countTotal=true` parameter is used (which is added by default by the app).
*   **Assisted Query Construction:**
    *   Includes logic to simplify complex queries. For instance, selected study phases are automatically translated and appended to the `filter.advanced` parameter for study searches.
    *   Default fields are pre-populated for search and single study endpoints but can be overridden.

## Technical Overview

*   **Framework:** [Next.js](https://nextjs.org/) (React framework)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (likely with [Shadcn UI](https://ui.shadcn.com/) components, inferred from `components.json`)
*   **API Interaction:** [Axios](https://axios-http.com/) for making HTTP requests.
*   **Core Logic:**
    *   `src/app/page.tsx`: Main application page, manages state, orchestrates API calls, and renders UI components.
    *   `src/lib/apiConfigs.ts`: Defines the structure and configurations for all supported API endpoints and their parameters. This is the central piece for the dynamic form generation and request building.
    *   `src/lib/utils.ts`: Contains utility functions, notably for resolving dynamic enum options for form inputs.
    *   `src/components/`: Contains reusable React components like `EndpointAccordionItem.tsx` (for rendering individual endpoint forms) and `ResponseDisplay.tsx` (for showing API output).
*   **API Documentation Reference:** The project root includes markdown files (`api-query-parameters.md`, `search-areas.md`, `data-model.md`) which appear to be local copies or summaries of the ClinicalTrials.gov API documentation. These were likely used as a reference during development.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
