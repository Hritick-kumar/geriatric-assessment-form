# Geriatric Care Assessment Form

A single-page web application for nurses to record assessment details when visiting elderly patients at home.

Built using React 19, TypeScript, Mantine, Zod, and Vite as part of a frontend developer assignment.

## Live Demo

- **GitHub Repository:** https://github.com/Hritick-kumar/geriatric-assessment-form.

## Tech Stack

- React 19 and TypeScript
- Vite
- Mantine UI and Mantine Form
- Zod for form validation
- Day.js for date handling
- Vitest and React Testing Library for testing
- Yarn

## Features

The form includes all 10 fields required by the assignment:

- Medical record number
- Patient name
- Date of birth
- Assessment date
- Mobility status
- Barthel Index score
- Number of regular medications
- Pharmacist review request
- Next review date
- Patient consent

### Form Validation

The validation rules are defined in `src/features/assessment/schema.ts` using the provided Zod schema.

- Medical record number must follow the required format.
- Patient name must contain between 2 and 60 characters.
- Patients must be at least 60 years old on the assessment date.
- The assessment date cannot be in the future.
- Mobility must be selected from the available options.
- Barthel Index scores must be between 0 and 100 and in steps of 5.
- Medication count must be between 0 and 30.
- A pharmacist review is required when the patient takes five or more regular medications.
- The next review date must be after the assessment date.
- Consent is required before submitting the form.

Validation is handled through Mantine Form and `zodResolver`. Errors appear below the relevant fields when validation fails.

### Form Submission

- Validation runs when a field loses focus and when the form is submitted.
- A sample-patient button fills in the form with the provided test data.
- A valid submission simulates a save operation with an approximately 800 ms delay.
- The submit button shows a loading state while saving.
- After submission, a success message displays the validated data returned by Zod.

There is no backend integration; the save operation is simulated on the frontend.

## TypeScript and Form Types

The `Assessment` type is inferred directly from the Zod schema using `z.infer`.

The form also needs to handle empty initial values before the user completes all the fields. The form value types account for these incomplete values, while the submitted data is validated against the original schema.

## Tests

The project uses Vitest and React Testing Library.

The tests cover:

- The age eligibility boundary, including a patient who is exactly 60 and one who is one day short of 60.
- Invalid values specified in the assignment.
- Valid boundary values for the Barthel Index and medication count.
- Loading the sample patient and submitting the form.
- Validation errors when the form is submitted empty.

## Getting Started

### Prerequisites

- Node.js compatible with the project dependencies
- Yarn 4, managed through Corepack

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/Hritick-kumar/geriatric-assessment-form.git
cd geriatric-assessment-form
yarn install
```

### Start the development server

```bash
yarn dev
```

Open the local URL shown in your terminal, usually `http://localhost:5173`.

### Run the project checks

```bash
yarn test
```

This runs the verification commands configured in the project.

To run the tests directly:

```bash
yarn vitest
```

## Time Spent

- **Project Setup & Tooling Configuration (25 mins)**:
  - Vite starter initialization, Yarn Berry package manager configuration, and resolving Node 22 JSDOM compatibility.
  - Adding Mantine v7/v9 core, form, dates, dayjs, and Zod dependencies.
  - Verifying the baseline linter (`vp check`), formatter, and test runner.
- **Zod Schema Implementation & Unit Tests (25 mins)**:
  - Authoring `src/features/assessment/schema.ts` with exact rules and cross-field `.refine()` logic.
  - Implementing boundary tests for patient age (turning 60 vs 1 day short) and verifying all Section 5 acceptance and rejection fixtures.
- **Form UI & Validation Wiring (35 mins)**:
  - Building `src/features/assessment/AssessmentForm.tsx` with all 10 required Mantine components.
  - Implementing `schemaResolver(assessmentSchema)` integration with blur and submit validation triggers.
  - Configuring dynamic Title Case options for mobility from the `MOBILITY` tuple.
  - Configuring `clampBehavior="none"` on numerical inputs to ensure clinical scores are never quietly altered.
  - Implementing simulated ~800ms submission delay with loading button states and parsed Zod output block.
- **Integration Tests & Verification Suite (20 mins)**:
  - Writing component integration tests in `AssessmentForm.test.tsx` verifying fixture load, save handler invocation, and clean 9-error empty submission.
  - Full end-to-end green run of `yarn test` (format, lint, stylelint, vitest, and production build).

## Remaining Work

- **None**: All 10 fields, schema resolver wiring, blur/submit validation behavior, ~800ms loading states, sample patient fixture loader, boundary tests, and production build requirements are **100% complete and passing**.
