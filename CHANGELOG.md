## 0.42.0 (2026-02-10)

### Features

- **front-end:** add i18n for recap modify warning modal
- **front-end:** add warning modal on recap modify for steps 2 and 3

### Maintenance

- **front-end:** remove extra blank line in CHANGELOG
- **front-end:** bump version to BETA.6 in Header

### Tests

- **front-end:** update RecapSection tests for warning modal

### ❤️ Thank You

- Antholife


## 0.41.0 (2026-02-03)

### Features

- **front-end:** add validation messages and Swiss placeholders for step 5
- **front-end:** wire email and address validation in UserDataMainSection and Step5
- **front-end:** make address fields editable with validation props in AddressCheckbox
- **front-end:** add inputType email to CheckboxField
- **step5:** add email and address validation
- **step5:** add email and address validation

### Maintenance

- **front-end:** update CHANGELOG for step 5 form improvements
- **front-end:** update initial user data with Swiss example

### ❤️ Thank You

- Antholife

## 0.40.1 (2026-02-02)

- Fix .lock for build

## 0.40.0 (2026-02-02)

### Bug Fixes

- **pdf-viewer:** responsive fullscreen margins from viewport width

### Refactoring

- **pdf-utils:** skill boxes wrap, details/content params, remove contentWidth and margin
- **pdf-content:** move signature/tampon to footer and drop selectedFlow from flows
- **pdf-constants:** update skills canvas dimensions and remove unused constants
- **pdf-types:** add CreateSkillBoxOptions and remove unused params

### Maintenance

- **deps:** add yarn patch file for pdfmake
- **ui:** bump Header to BETA.5 and fix Step5Recap social labels
- **deps:** use yarn patch for pdfmake and add patch-package

### Tests

- **pdf:** align tests with updated constants and params

### ❤️ Thank You

- Antholife

## 0.30.0 (2026-01-30)

### Features

- **pdf:** lock PDF permissions to prevent modification
- **attestation:** group comments by activity in preview
- **attestation:** merge import config with initial
- **attestation:** validate config modal fields, no empty input

### Bug Fixes

- **attestation:** hide PDF update overlay on step 5 when no scroll

### Performance

- **attestation:** improve PDF preview rendering quality

### Refactoring

- **attestation:** update Header, AppLayout and ContentHeader

### Documentation

- **front-end:** update CHANGELOG

### Maintenance

- **front-end:** truncate hard skill names to 65 characters
- **front-end:** remove BetaNotOpen component and its test

### Tests

- **attestation:** improve SkillsConfigModal tests

### ❤️ Thank You

- Antholife

## 0.28.0 (2026-01-29)

### Features

- **recap:** add divider between skill blocks in Step3Recap

### Refactoring

- **attestation:** update ActivityCard, Stepper, ActivitiesMainSection and page index
- **pdf:** update content and utils for assets and layout
- **pdf:** reduce skill box width (char ratio 0.55, margins 6)
- **pdf:** simplify header layout with buildHeaderCheckedFieldsMask and isFieldActive

### Documentation

- **front:** update CHANGELOG

### Maintenance

- **i18n:** update locales en/fr
- **front:** move PDF/images from public to src/adapter/ui/assets

### ❤️ Thank You

- Antholife

## 0.26.1 (2026-01-28)

This was a version bump only for front-end to align it with other projects, there were no code changes.

## 0.26.0 (2026-01-28)

### Features

- **i18n:** ajouter traduction organizationDefault pour filtre par défaut
- **attestation:** ajouter prop fullWidth au composant FilterSelect pour mode activities

### Bug Fixes

- **test:** normaliser les séparateurs de chemin dans getExpectedTestPath pour gérer correctement les sous-dossiers
- **test:** mettre à jour FilterSelect.test.tsx pour utiliser la nouvelle API FilterOption
- **attestation:** améliorer comportement du scroll lors de l'ouverture d'un accordéon dans SkillsList

### Refactoring

- **attestation:** améliorer formatage du code dans DataFilter et FilterSelect

### Style

- **test:** améliorer formatage dans FilterSelect.test.tsx
- **attestation:** ajouter backgroundColor default au SearchInput
- **attestation:** ajouter backgroundColor default aux inputs du RangeSlider
- **attestation:** améliorer style des bordures et hover dans CardSelector
- **attestation:** ajouter style primary.main et fontWeight 700 pour texte des checkboxes cochées

### ❤️ Thank You

- Antholife

## 0.24.1 (2026-01-27)

### Bug Fixes

- **deps:** align dependency-cruiser version with yarn.lock for immutable install

### ❤️ Thank You

- Antholife

## 0.24.0 (2026-01-27)

### Features

- **domain:** add layout types, locale service and type/interface conventions

### Bug Fixes

- **pdf:** break circular deps in utils by importing from concrete modules instead of index

### Refactoring

- **adapter:** attestation components, Header, SkillsConfigModal and commentsStorage utils
- **infra:** i18n request, routing, locales and metadata service
- **app:** move root layout to [locale], remove giveety-specific layout

### Documentation

- **changelog:** update front-end changelog

### Maintenance

- **deps:** update yarn.lock
- **package:** simplify test scripts and remove legacy src/test/setup
- **config:** remove unused @/tests path from tsconfig and vitest alias
- **nx:** run architecture, unit and functional make targets in test pipeline

### Tests

- **functional:** add functional tests for attestation components, app layout and pages
- **unit:** add unit tests for domain, infra, adapter pdf-attestation, theme and utils
- **architecture:** add CustomValidator, TestCoverageRules, dependency-cruiser and test mocks

### ❤️ Thank You

- Antholife

## 0.22.6 (2026-01-26)

### 🚀 Features

- **export:** export only modified userData fields instead of entire structure

### 🩹 Fixes

- **export:** remove unused isMounted state and fix TypeScript error

### ❤️ Thank You

- Antholife

## 0.22.5 (2026-01-26)

### 🚀 Features

- **config:** add export configuration functionality

### ❤️ Thank You

- Antholife

## 0.22.4 (2026-01-26)

### 🚀 Features

- **i18n:** improve reset tab button translations and add relations display
- **config:** add individual reset buttons for each userData field

### 🩹 Fixes

- **types:** resolve TypeScript errors in userData field reset functions

### ❤️ Thank You

- Antholife

## 0.22.0 (2026-01-26)

### 🚀 Features

- **i18n:** add translations for configuration editor modal
- **attestation:** integrate configuration editor button and active configs display
- **config:** add front-end configuration editor modal
- **storage:** add centralized storage utilities for skills, activities and user data

### 🩹 Fixes

- **pdf:** improve scroll position restoration and calculation

### ❤️ Thank You

- Antholife

## 0.20.1 (2026-01-23)

- Resolved incorrect relationship between active and actual version; display bug

## 0.20.0 (2026-01-23)

### Added

- **feat(ui)**: Add new reorganized component structure with 91 new files
  - Add `components/basic/attestation/` directory with attestation-specific basic components
  - Add `components/basic/common/` directory with common basic components
  - Add `components/composite/attestation/` directory with attestation-specific composite components
  - Add `components/composite/common/` directory with common composite components
  - Add `components/pages/attestation/` directory with attestation page components
  - Add `pdf-attestation/` directory with new PDF system (config, content, services, utils)
  - Add new PDF generation utilities and services
  - Add new component exports and index files

- **feat(infra)**: Add new infrastructure services
  - Add `infra/routing.ts` (replaces `routing.tsx`)
  - Add `infra/services/metadata.ts` for metadata handling
  - Add `infra/services/index.ts` for service exports

- **feat(ui)**: Add enhanced theme animations and utilities
  - Add new animation utilities
  - Add activity image utilities
  - Add layout constants
  - Add media query utilities

### Changed

- **refactor(ui)**: Reorganize component structure for better maintainability
  - Restructure basic components into `attestation/` and `common/` subdirectories
  - Restructure composite components into `attestation/` and `common/` subdirectories
  - Restructure page components into `attestation/` subdirectory
  - Migrate PDF system from `pdf/` to `pdf-attestation/` directory

- **refactor(ui)**: Update component index/exports
  - Update `components/basic/index.ts` with new structure
  - Update `components/composite/index.ts` with new structure
  - Update `components/pages/index.ts` with new structure

- **refactor(ui)**: Update themes and utilities
  - Update theme animations
  - Update theme index with new utilities
  - Update activity images utility
  - Update logo SVG utility
  - Update layout constants
  - Update media queries

- **refactor(app)**: Update pages and layout components
  - Update `AppLayout.tsx` component
  - Update attestation layout (`layout.tsx`)
  - Update attestation page (`page.tsx`)

- **refactor(domain)**: Update types and services
  - Update attestation types
  - Update PDF types
  - Update formatting services
  - Update service exports
  - Update `softSkills.json` data

- **refactor(i18n)**: Update internationalization infrastructure
  - Update i18n index with improved exports
  - Update navigation utilities
  - Update request handling
  - Update routing configuration

- **refactor(infra)**: Update general infrastructure files
  - Update logger implementation
  - Update version handling
  - Update proxy configuration
  - Migrate routing from `.tsx` to `.ts`

- **chore(deps)**: Update dependencies
  - Update `package.json` dependencies
  - Update `yarn.lock` with new dependency versions
  - Update `CHANGELOG.md`

### Removed

- **refactor(ui)**: Remove old basic components (26 files)
  - Remove old `ActivityCard.tsx`
  - Remove old `AddressCheckbox.tsx`
  - Remove old `AdviceCard.tsx`
  - Remove old `AttestationStepper.tsx`
  - Remove old `BetaNotOpen.tsx`
  - Remove old `Button.tsx`
  - Remove old `CheckboxField.tsx`
  - Remove old `CommentCard.tsx`
  - Remove old `ContentHeader.tsx`
  - Remove old `CustomTooltip.tsx`
  - Remove old `FieldDisplay.tsx`
  - Remove old `Footer.tsx`
  - Remove old `LanguageSwitcher.tsx`
  - Remove old `Modal.tsx`
  - Remove old `RangeSlider.tsx`
  - Remove old `SearchInput.tsx`
  - Remove old `SelectedItem.tsx`
  - Remove old `SkillCard.tsx`
  - Remove old `SkillRecapBox.tsx`
  - Remove old recap components directory

- **refactor(ui)**: Remove old composite components (17 files)
  - Remove old `ActivitiesList.tsx`
  - Remove old `ActivitiesMainSection.tsx`
  - Remove old `AttestationPreview.tsx`
  - Remove old `AttestationSuccessModal.tsx`
  - Remove old `CardSelector.tsx`
  - Remove old `CommentsMainSection.tsx`
  - Remove old `DataFilter.tsx`
  - Remove old `FilterSelect.tsx`
  - Remove old `Header.tsx`
  - Remove old `NavigationStepper.tsx`
  - Remove old `RecapSection.tsx`
  - Remove old `SelectedItemsList.tsx`
  - Remove old `SelectedItemsWithRelations.tsx`
  - Remove old `SkillsList.tsx`
  - Remove old `SkillsMainSection.tsx`
  - Remove old `StepperScrollButton.tsx`
  - Remove old `UserDataMainSection.tsx`

- **refactor(ui)**: Remove old page components (7 files)
  - Remove old `Step1Content.tsx`
  - Remove old `Step2Content.tsx`
  - Remove old `Step3Content.tsx`
  - Remove old `Step4Content.tsx`
  - Remove old `Step5Content.tsx`
  - Remove old `Step6Content.tsx`
  - Remove old `attestation.tsx`

- **refactor(ui)**: Remove old hooks and PDF files (39 files)
  - Remove old `hooks/index.ts`
  - Remove old PDF system (`pdf/` directory)
    - Remove old PDF config files
    - Remove old PDF content files
    - Remove old PDF services
    - Remove old PDF utilities
  - Remove old `utils/pdfmakeFonts.ts`

- **refactor(domain)**: Remove old metadata service
  - Remove `domain/services/metadata.ts`

- **refactor(infra)**: Remove old routing file
  - Remove `infra/routing.tsx` (replaced by `routing.ts`)

### ❤️ Thank You

- Antholife

## 0.19.0-0 (2026-01-21)

### 🚀 Features

- integrate BetaNotOpen with content protection
- add BetaNotOpen fullscreen component
- add version display in header
- restructure routes to use giveety/attestation path

### ❤️ Thank You

- Antholife

## 0.18.3 (2026-01-21)

### 🚀 Features

- restructure routes to use giveety/attestation path

### ❤️ Thank You

- Antholife

## 0.18.2 (2026-01-21)

DevOps Testing

## 0.18.1 (2026-01-21)

- Fix DevOps (testing)

## 0.18.0 (2026-01-21)

### 🚀 Features

- **front-end:** enhance Vitest configuration with comprehensive coverage
- **front-end:** migrate source code to monorepo structure
- **front-end:** migrate public assets to monorepo structure
- **front-end:** add Vitest testing infrastructure
- **front-end:** add build and development configuration
- **front-end:** add project configuration files

### ❤️ Thank You

- Antholife

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.18.0-web+pdf.0.12.0+DevOps.0.6.1] - 2026-01-XX

### Added

#### DevOps [0.6]

- **feat(devops)**: Add Nx monorepo workspace configuration with `nx.json` for project management and build orchestration
- **feat(devops)**: Add `workspaceLayout` configuration in `nx.json` with `appsDir` and `libsDir` for monorepo structure
- **feat(devops)**: Add Nx target defaults with caching enabled for `build`, `lint`, and `test` targets
- **feat(devops)**: Add Nx release configuration with independent project versioning and git-tag version resolver
- **feat(devops)**: Add `project.json` for front-end project with Nx targets: `lint`, `type-check`, and `test`
- **feat(devops)**: Add `tsconfig.base.json` at workspace root for shared TypeScript configuration across projects
- **feat(devops)**: Add Vitest testing framework with configuration file `vitest.config.ts`
- **feat(devops)**: Add test setup file `src/test/setup.ts` with `@testing-library/jest-dom` matchers
- **feat(devops)**: Add testing dependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `@testing-library/dom`, `jsdom`, `@vitejs/plugin-react`
- **feat(devops)**: Add Nx commands in Makefile: `nx-projects`, `nx-affected`, `nx-graph`, `nx-format`, `nx-lint`, `nx-type-check`, `nx-test`, `nx-reset`
- **feat(devops)**: Add workspace-level `package.json` with Nx and ESLint dependencies
- **feat(devops)**: Add `.gitignore` configuration for Nx cache and workspace data
- **feat(devops)**: Add Docker Compose configuration update to use `apps/front-end/Dockerfile` path

#### WEB [0.18]

- **feat(ui)**: Migrate project structure to monorepo layout with `apps/front-end/` directory
- **feat(ui)**: Add project-specific `package.json` in `apps/front-end/` with all application dependencies
- **feat(ui)**: Add project-specific `tsconfig.json` extending `tsconfig.base.json` for TypeScript configuration
- **feat(ui)**: Add project-specific `.yarnrc.yml` for Yarn package manager configuration
- **feat(ui)**: Add project-specific `.gitignore` with Next.js-specific ignore patterns
- **feat(ui)**: Add project-specific `yarn.lock` for dependency version locking
- **feat(ui)**: Add project-specific `eslint.config.mjs` for ESLint configuration
- **feat(ui)**: Add project-specific `next.config.ts` for Next.js configuration
- **feat(ui)**: Add project-specific `Dockerfile` for containerized builds
- **feat(ui)**: Add project-specific `README.md` for project documentation
- **feat(ui)**: Migrate all source code from root `src/` to `apps/front-end/src/`
- **feat(ui)**: Migrate all public assets from root `public/` to `apps/front-end/public/`
- **feat(ui)**: Migrate all tools and dev configuration from root `tools/` to `apps/front-end/tools/`
- **feat(ui)**: Add Mulish font family (all weights and styles) replacing Azeret font family
- **feat(ui)**: Add comprehensive test infrastructure with Vitest and React Testing Library

#### PDF [0.12]

- **feat(pdf)**: Migrate all PDF generation code to `apps/front-end/src/adapter/ui/pdf/` structure
- **feat(pdf)**: Maintain PDF functionality during monorepo migration

### Changed

#### DevOps [0.6]

- **refactor(devops)**: Restructure project from single-package to Nx monorepo workspace
- **refactor(devops)**: Update `Makefile` to use Nx commands instead of direct npm/yarn commands
- **refactor(devops)**: Update `compose.yaml` to reference `apps/front-end/Dockerfile` instead of root `Dockerfile`
- **refactor(devops)**: Update `.gitignore` to ignore root `yarn.lock` while keeping `apps/front-end/yarn.lock`
- **refactor(devops)**: Update workspace structure to support future multi-app/multi-lib expansion

#### WEB [0.18]

- **refactor(ui)**: Move all application code from root directory to `apps/front-end/` directory
- **refactor(ui)**: Update import paths to reflect new monorepo structure
- **refactor(ui)**: Update TypeScript path aliases to work with monorepo structure
- **refactor(ui)**: Replace Azeret font family with Mulish font family across all components
- **refactor(ui)**: Update font loading and configuration for Mulish font family
- **refactor(ui)**: Update Docker build context to `apps/front-end/` directory
- **refactor(ui)**: Update all relative paths in configuration files to reflect new structure

#### PDF [0.12]

- **refactor(pdf)**: Update PDF generation code paths to new monorepo structure
- **refactor(pdf)**: Maintain PDF functionality with updated import paths

### Removed

#### DevOps [0.6]

- **remove(devops)**: Remove root-level `Dockerfile` (moved to `apps/front-end/Dockerfile`)
- **remove(devops)**: Remove root-level `eslint.config.mjs` (moved to `apps/front-end/eslint.config.mjs`)
- **remove(devops)**: Remove root-level `next.config.ts` (moved to `apps/front-end/next.config.ts`)
- **remove(devops)**: Remove root-level `tsconfig.json` (replaced by `tsconfig.base.json` and `apps/front-end/tsconfig.json`)
- **remove(devops)**: Remove root-level `CHANGELOG.md` (moved to `apps/front-end/CHANGELOG.md`)
- **remove(devops)**: Remove root-level `README.md` (moved to `apps/front-end/README.md`)
- **remove(devops)**: Remove root-level `yarn.lock` (replaced by `apps/front-end/yarn.lock`)

#### WEB [0.18]

- **remove(ui)**: Remove Azeret font files (Azeret-Bold.ttf, Azeret-Light.ttf, Azeret-Medium.ttf)
- **remove(ui)**: Remove root-level `src/` directory (moved to `apps/front-end/src/`)
- **remove(ui)**: Remove root-level `public/` directory (moved to `apps/front-end/public/`)
- **remove(ui)**: Remove root-level `tools/` directory (moved to `apps/front-end/tools/`)
- **remove(ui)**: Remove root-level `data_tmp/` directory (moved to `apps/front-end/src/data_tmp/`)

### Fixed

#### DevOps [0.6]

- **fix(devops)**: Fix Nx workspace configuration to properly resolve project paths
- **fix(devops)**: Fix TypeScript configuration inheritance with `tsconfig.base.json`
- **fix(devops)**: Fix Docker Compose build context to correctly reference new project structure
- **fix(devops)**: Fix `.gitignore` to properly handle monorepo structure with separate `yarn.lock` files

#### WEB [0.18]

- **fix(ui)**: Fix all import paths after monorepo migration
- **fix(ui)**: Fix TypeScript path aliases after structure change
- **fix(ui)**: Fix font loading after font family change from Azeret to Mulish
- **fix(ui)**: Fix Docker build process with new directory structure

## [0.16.0-web+pdf.0.11.1] - 2026-01-19

### Added

#### WEB [0.16]

- **feat(ui)**: Add responsive design support for all UI components, supporting mobile views down to 320px
- **feat(ui)**: Add `useIsMobile` and `useIs1000px` hooks in `mediaQueries.ts` utility for centralized media query management
- **feat(ui)**: Add `layoutConstants.ts` with `MAIN_CONTENT_PADDING_TOP` constants for responsive layout padding
- **feat(ui)**: Add `:focus-visible` polyfill in client provider to support browsers without native support
- **feat(ui)**: Add responsive layout to `Header` component with mobile menu, hamburger icon, and adaptive logo sizing
- **feat(ui)**: Add responsive layout to `Footer` component with adaptive padding, logo size, column layout, and typography
- **feat(ui)**: Add responsive layout to `AttestationStepper` with column layout on mobile, adaptive padding, and auto-scroll for tablet views
- **feat(ui)**: Add responsive layout to `NavigationStepper` with column layout on mobile and adaptive button arrangement
- **feat(ui)**: Add responsive layout to `FilterSelect` with column arrangement for slider and input on mobile
- **feat(ui)**: Add responsive layout to `ActivitiesList` with months displayed above activities on mobile and dotted border separator
- **feat(ui)**: Add responsive layout to all step content components (Step2Content, Step3Content, Step4Content, Step5Content, Step6Content)
- **feat(ui)**: Add responsive layout to `SelectedItemsList`, `AttestationPreview`, and `AdviceCard` with conditional sticky positioning
- **feat(ui)**: Add responsive layout to `RecapStepBox` with icon-only "Modify" button on mobile and text+icon on desktop
- **feat(ui)**: Add responsive layout to `AttestationSuccessModal` with adaptive padding, font sizes, and button layouts
- **feat(ui)**: Add responsive layout to `ContentHeader` with adaptive font sizes and gaps
- **feat(ui)**: Add `inMenu` prop to `LanguageSwitcher` for mobile menu integration with proper color and spacing
- **feat(ui)**: Add responsive close button positioning in `Modal` component for fullscreen mode

### Changed

#### WEB [0.16]

- **refactor(ui)**: Refactor `Button` component to use `sx` prop directly instead of `layout` and `overrideStyle` props for better Material-UI integration
- **refactor(ui)**: Update `Header` component with responsive heights (`{ xs: "70px", sm: "90px" }`), padding, logo sizes, and mobile menu layout
- **refactor(ui)**: Update `Footer` component with responsive padding (`{ xs: "20px 8px", sm: "30px 16px", md: "40px 120px 20px 120px" }`), logo width, and column styles
- **refactor(ui)**: Update `AttestationStepper` with responsive layout (`flexDirection: { xs: "column", sm: "row" }`), padding, height, and font sizes
- **refactor(ui)**: Update `AppLayout` to use responsive `paddingTop` based on mobile view (`MAIN_CONTENT_PADDING_TOP.MOBILE` vs `DESKTOP`)
- **refactor(ui)**: Update `SelectedItemsList` with responsive `maxWidth` (`{ xs: "100%", lg: "280px" }`) and conditional sticky positioning
- **refactor(ui)**: Update `AttestationPreview` with responsive display (`{ xs: fullscreen ? "flex" : "none", lg: "flex" }`) and conditional sticky positioning
- **refactor(ui)**: Update `ActivitiesMainSection` and `SkillsMainSection` with responsive `maxWidth` (`{ xs: "100%", lg: "630px" }`)
- **refactor(ui)**: Update `ActivitiesList` with responsive layout: months above activities on mobile, vertical line hidden on mobile, dotted border under month
- **refactor(ui)**: Update `FilterSelect` with responsive `flexDirection` (`{ xs: "column", sm: "row" }`) for slider and input arrangement
- **refactor(ui)**: Update `NavigationStepper` with responsive layout, padding, height, and button arrangement
- **refactor(ui)**: Update `RecapStepBox` with responsive "Modify" button: icon-only on mobile, text+icon on desktop, same line as "Step X" on mobile
- **refactor(ui)**: Update `ContentHeader` with responsive font sizes for step number, title, and description
- **refactor(ui)**: Update `LanguageSwitcher` to support `inMenu` prop with conditional colors and spacing between text and arrow
- **refactor(ui)**: Update `Modal` close button with responsive positioning (`{ xs: 8, sm: 16 }`) and increased `zIndex` for fullscreen mode
- **refactor(ui)**: Update `AdviceCard` with responsive `maxWidth` and conditional sticky positioning
- **refactor(ui)**: Update `UserDataMainSection` and `RecapSection` with responsive gaps
- **refactor(infra)**: Simplify `routing.tsx` by removing dynamic route logic and `RecursiveRouteKey` type conditions
- **refactor(infra)**: Simplify `routing.ts` by removing `isDynamic` variable and conditional logic for dynamic routes
- **refactor(eslint)**: Remove `no-override-style` custom ESLint rule and associated file

#### PDF [0.12]

- **refactor(pdf)**: Update `skillBoxUtils.ts` to improve box height calculation for long skill names

### Fixed

#### WEB [0.16]

- **fix(ui)**: Fix `LanguageSwitcher` colors when displayed inside mobile menu (use `primary.main` instead of `background.default`)
- **fix(ui)**: Fix spacing between text and arrow in `LanguageSwitcher` when in mobile menu using `display: flex` and `justifyContent: space-between`
- **fix(ui)**: Fix `:focus-visible` pseudo-class warning from Material-UI by adding JavaScript polyfill for browsers without native support
- **fix(ui)**: Fix close button not clickable in fullscreen `AttestationPreview` modal by increasing `zIndex` and adjusting positioning
- **fix(ui)**: Fix `ActivitiesList` layout on mobile by ensuring proper flex properties and margins
- **fix(ui)**: Fix `Step5Recap` space-between issue on mobile by adding `width: "100%"` to container Box
- **fix(ui)**: Fix `Footer` SVG mask visual glitch by adjusting `waveSvg` path to start at `y=0` and adding proper `viewBox`
- **fix(ui)**: Fix `AttestationStepper` auto-scroll to only activate on tablet view (1000px) and disable on mobile and desktop

### Removed

#### WEB [0.16]

- **remove(eslint)**: Remove `no-override-style` custom ESLint rule and `tools/dev/custom-rules/no-override-style.mjs` file
- **remove(ui)**: Remove `overrideStyle` prop from `Button` component
- **remove(ui)**: Remove `layout` prop from `Button` component in favor of direct `sx` prop usage

## [0.14.0-web+pdf.0.11] - 2026-01-17

### Added

#### PDF [0.11]

- **feat(pdf)**: Add progressive Y spacing between experience positions with `EXP_POSITION_Y_SPACING` constant for better visual separation
- **feat(pdf)**: Add dynamic position generation with caching system in `expsPositions.config.ts` to support unlimited number of experiences
- **feat(pdf)**: Add `lineDirection` calculation in position generation to optimize performance
- **feat(pdf)**: Add `HEADER_COLUMN_WIDTHS_EXPS_STEP2` constant for experiences flow step 2 header column widths
- **feat(pdf)**: Add `UNDERLINE_IMAGE_WIDTH_FLOW_EXPS_DETAILS` constant for experiences flow details title underline
- **feat(pdf)**: Add `UNDERLINE_IMAGE_WIDTH_EXPS_YEARS_DETAILS` constant for year titles underline in experiences details
- **feat(pdf)**: Add filtering logic in `expsDetails` to only show activities with at least one associated skill
- **feat(pdf)**: Add `unbreakable: true` to year blocks and activity items in `expsDetails` to prevent page breaks
- **feat(pdf)**: Add header content directly in `expsView` for experiences flow step 2 to fix header height issues
- **feat(pdf)**: Add `underlineImage` parameter to `HeaderContentParams` type
- **feat(pdf)**: Add extended parameters to `ExpsViewContentParams` (userData, logoSvg, attestationTitle, qrcodeImage, profilePictureBase64, selectedFlow, currentPage)

#### WEB [0.14]

- **feat(ui)**: Add automatic skill-activity relation management in `Step3Content` for experiences flow
- **feat(ui)**: Add logic to automatically create relations when skills are added and remove relations when skills are removed

### Changed

#### PDF [0.11]

- **refactor(pdf)**: Rename `createHeaderContentCommonFlow` to `createHeader` for unified header creation function
- **refactor(pdf)**: Remove `selectedFlow` parameter from `calculateHeaderHeight` and `getPageMargins` in `headerUtils.ts` to simplify header height calculation
- **refactor(pdf)**: Optimize `expsPositions.config.ts` with dynamic generation and caching instead of pre-generating all positions
- **refactor(pdf)**: Optimize `expsPositions.config.ts` by reusing base position templates instead of creating new objects on each call
- **refactor(pdf)**: Optimize `expsChartUtils.ts` by calculating `spacingFactor` once before loop iteration
- **refactor(pdf)**: Optimize `headerUtils.ts` by simplifying field counting logic with helper function and array filtering
- **refactor(pdf)**: Move experiences flow step 2 header logic directly into `expsView` page content to fix header height issues
- **refactor(pdf)**: Update `createHeader` to conditionally show attestation title instead of name for experiences flow step 2
- **refactor(pdf)**: Update `createHeader` to conditionally hide phone/email/address/website/social for experiences flow step 2
- **refactor(pdf)**: Rename `UNDERLINE_IMAGE_WIDTH_SKILLS_DETAILS` to `UNDERLINE_IMAGE_WIDTH_FLOW_SKILLS_DETAILS` for clarity
- **refactor(pdf)**: Update `getContentForExpsFlow` to pass additional parameters (userData, logoSvg, attestationTitle, qrcodeImage, profilePictureBase64, selectedFlow) to `createExpsView`
- **refactor(pdf)**: Update `expsDetails` section header to use `TITLE_FONT_SIZE` instead of `SUBTITLE_FONT_SIZE` and remove custom margins
- **refactor(pdf)**: Update `expsDetails` to filter activities by skills before grouping by year
- **refactor(pdf)**: Update `UNDERLINE_IMAGE_MARGIN` to remove top margin (from `[PAGE_MARGIN_X, 5, PAGE_MARGIN_X, 20]` to `[PAGE_MARGIN_X, 0, PAGE_MARGIN_X, 20]`)
- **refactor(pdf)**: Update `TIMELINE_BAR_HEIGHT` from 460 to 420 points
- **refactor(pdf)**: Update `TIMELINE_BAR_Y` from 275 to 320 points
- **refactor(pdf)**: Update `HEADER_PROFILE_PICTURE_Y_EXPS` from 140 to 180 points
- **refactor(pdf)**: Update `createAttestationPDFDocument` to pass `underlineImage` to header and remove `selectedFlow` from `getPageMargins` call
- **refactor(pdf)**: Update date separator in experience boxes from bullet point "•" to middle dot "·" for better visual appearance

#### WEB [0.14]

- **refactor(ui)**: Fix import path casing in `index.ts` from `"./Attestation"` to `"./attestation"` to match actual filename

### Fixed

#### PDF [0.11]

- **fix(pdf)**: Fix broken header heights on other pages by moving experiences flow step 2 header logic directly into page content instead of using dynamic margins (which pdfmake doesn't support properly)
- **fix(pdf)**: Fix header height calculation issues where smaller headers on other pages had non-dynamic margins causing layout problems
- **fix(pdf)**: Fix experience positions alignment by ensuring lines follow the same progressive Y spacing as boxes
- **fix(pdf)**: Fix experiences details showing activities without associated skills by filtering them out
- **fix(pdf)**: Fix page break issues in experiences details by adding `unbreakable: true` to year blocks and activity items

### Removed

#### PDF [0.11]

- **remove(pdf)**: Remove `selectedFlow` parameter from header utility functions to simplify API
- **remove(pdf)**: Remove pre-generated position configurations (1-8) in favor of dynamic generation with caching
- **remove(pdf)**: Remove `DETAILS_CONTENT_MARGIN_TOP` and `DETAILS_CONTENT_MARGIN_X` from `expsDetails` imports (no longer used)
- **remove(pdf)**: Remove `HEADER_LOGO_MARGIN` and `HEADER_TITLE_EXPS_FONT_SIZE` from header imports (no longer used)

## [0.13.0-web+pdf.0.10] - 2026-01-16

### Added

#### PDF [0.10]

- **feat(pdf)**: Add experiences details content (`expsDetails`) for step 3 of experiences flow
- **feat(pdf)**: Add activity grouping by year (most recent first) in experiences details
- **feat(pdf)**: Add year title display with underline image for each year block in experiences details
- **feat(pdf)**: Add activity display with date range (→), title (with star for favorites), organization, and associated skill boxes
- **feat(pdf)**: Add `expsDetailsTitle` translation key for experiences details section
- **feat(pdf)**: Add centralized PDF translation utility (`pdfTranslations.ts`) to avoid passing translation function as parameter everywhere
- **feat(pdf)**: Add `getCommentsContent` function in `flows.ts` for shared step 4 (comments) content generation
- **feat(pdf)**: Add `getFinalPageContent` function in `flows.ts` for shared step 6 (final page) content generation
- **feat(pdf)**: Add `createSectionHeader` utility function in `sectionUtils.ts` for reusable section headers with underline images
- **feat(pdf)**: Add `userData` and `selectedFlow` parameters to `ExpsDetailsContentParams` for header height calculation
- **feat(pdf)**: Add `selectedFlow` and `currentStep` to `HeaderContentParams` type for flow-aware header generation
- **feat(pdf)**: Add `GenerateAttestationPdfParams` type to `pdf.types.ts` for centralized type definitions
- **feat(pdf)**: Add `absolutePosition` support in `expsDetails` to position content above header and fix spacing issues

#### WEB [0.13]

- **feat(ui)**: Add `onModify` prop support to `Step1Recap` component for consistency with other recap components

### Changed

#### PDF [0.10]

- **refactor(pdf)**: Rename `flowContent.ts` to `flows.ts` and move to root of `content/` directory as root orchestrator
- **refactor(pdf)**: Rename all content creation functions to remove "Content" suffix (e.g., `createSkillsDetailsContent` → `createSkillsDetails`, `createExpsDetailsContent` → `createExpsDetails`)
- **refactor(pdf)**: Rename `createHeaderContentSkillsFlow` to `createHeaderContentCommonFlow` for better semantic naming
- **refactor(pdf)**: Rename `createHeaderContentExpsFlow` to `createHeaderContentExpsFlowForStep2` to clarify its usage
- **refactor(pdf)**: Extract common step 4 (comments) and step 6 (final page) logic into shared functions in `flows.ts`
- **refactor(pdf)**: Move `createSectionHeader` from `flows.ts` to `utils/sectionUtils.ts` for better code organization
- **refactor(pdf)**: Remove redundant `createStep3Section` helper function, integrating logic directly into flow functions
- **refactor(pdf)**: Optimize `flows.ts` by extracting common patterns, removing unnecessary variables, and ensuring consistent parameter passing
- **refactor(pdf)**: Update `getContentForSkillsFlow` and `getContentForExpsFlow` to be async functions for conditional `underlineImage` loading
- **refactor(pdf)**: Make `underlineImage` loading conditional based on `skillsDetailsParams` and `expsDetailsParams` existence to optimize PDF generation performance
- **refactor(pdf)**: Remove `t` parameter from all PDF content functions, using `getPdfTranslation()` directly instead
- **refactor(pdf)**: Update `createAttestationPDFDocument` to use `getPdfTranslation()` internally instead of receiving `t` as parameter
- **refactor(pdf)**: Update `generateAttestationPdf` to initialize PDF translations with `setPdfTranslation(t)` at the beginning
- **refactor(pdf)**: Update `expsDetails` to use `absolutePosition` with calculated `y` position (`headerHeight - 100`) to place content above header
- **refactor(pdf)**: Update `createHeader` to use `selectedFlow === "experiences" && currentPage === 1` for experiences flow header selection
- **refactor(pdf)**: Update `calculateHeaderHeight` to add 100 points only if `selectedFlow === "experiences" && currentPage === 1`
- **refactor(pdf)**: Update `getPageMargins` to return static margins (pdfmake does not support dynamic margins with `currentPage`)
- **refactor(pdf)**: Update `expPositions` variable name to `expsPositions` for consistency across codebase
- **refactor(pdf)**: Update `createExpsDetails` to accept `underlineImage` as direct parameter instead of being part of `ExpsDetailsContentParams`
- **refactor(pdf)**: Update `getContentForExpsFlow` to pass `userData` and `selectedFlow` to `expsDetailsParams`
- **refactor(domain)**: Move `GenerateAttestationPdfParams` type from `generateAttestationPdf.ts` to `pdf.types.ts` for centralized type definitions
- **refactor(domain)**: Add `AttestationSelection` and `SkillActivityRelation` imports to `pdf.types.ts` for type completeness

#### WEB [0.13]

- **refactor(ui)**: Update `Step1Recap` to accept and pass `onModify` prop to `RecapStepBox` for consistency
- **refactor(domain)**: Remove duplicate `RecapStepBoxProps` type definition from `attestation.types.ts` (kept in `recap.types.ts`)

### Fixed

#### PDF [0.10]

- **fix(pdf)**: Fix excessive spacing between header and title in `expsDetails` for experiences flow by using `absolutePosition` to place content above header
- **fix(pdf)**: Fix PDF generation timing issue causing preview scrolling problems by making `underlineImage` loading conditional
- **fix(pdf)**: Fix static header height compensation in experiences flow by calculating `contentYPosition` as `headerHeight - 100`
- **fix(pdf)**: Fix `pageMargins` dynamic injection issue by using static margins (pdfmake limitation)

#### WEB [0.13]

- **fix(types)**: Fix TypeScript error in `ActivityCard.tsx` where `StaticImageData | undefined` was not assignable to `string | StaticImport` by storing result in variable and checking for `undefined` before passing to `Image` component
- **fix(types)**: Fix module export conflict where `RecapStepBoxProps` was exported from both `attestation.types.ts` and `recap.types.ts` by removing duplicate definition
- **fix(types)**: Fix `Step1RecapProps` missing `onModify` property by adding optional `onModify?: () => void` to type definition

### Removed

#### PDF [0.10]

- **remove(pdf)**: Remove `t` parameter from all PDF content generation functions and services
- **remove(pdf)**: Remove `underlineImage` from `ExpsDetailsContentParams` type (now passed as direct parameter)
- **remove(pdf)**: Remove `underlineImage` from `AttestationPDFDocumentProps` type
- **remove(pdf)**: Remove redundant `createStep3Section` helper function from `flows.ts`
- **remove(pdf)**: Remove unnecessary variables and simplify parameter passing in `createAttestationPDFDocument`

#### WEB [0.13]

- **remove(domain)**: Remove duplicate `RecapStepBoxProps` type definition from `attestation.types.ts`

## [0.12.0-web+pdf.0.9] - 2026-01-15

### Added

#### PDF [0.9]

- **feat(pdf)**: Implement experiences flow timeline visualization with vertical tertiary bar for step 2
- **feat(pdf)**: Add experience boxes rendering with date range, duration badge, title, and organization
- **feat(pdf)**: Add connecting lines (L-shaped) between timeline bar and experience boxes with dots at endpoints
- **feat(pdf)**: Add `expsPositions.config.ts` with manual position configurations for 1-8 experiences
- **feat(pdf)**: Add `expBoxUtils.ts` for experience box creation, date formatting, and duration calculation
- **feat(pdf)**: Add `expsChartUtils.ts` for experience positions calculation and line/dot graphics generation
- **feat(pdf)**: Add `lineGraphicsUtils.ts` for shared L-shaped line calculation utilities (used by both skills and experiences flows)
- **feat(pdf)**: Add experiences flow header layout with distinct structure (logo/title/QR top row, name/photo/email bottom row)
- **feat(pdf)**: Add conditional profile picture rendering with fallback to user logo SVG if picture not checked
- **feat(pdf)**: Add phone number display under name in experiences flow header
- **feat(pdf)**: Add conditional contact information layout (email moves left if address/web/network are checked)
- **feat(pdf)**: Add flow-based content generation with `getContentForSkillsFlow` and `getContentForExpsFlow` functions
- **feat(pdf)**: Add flow-based header generation with `createHeaderContentSkillsFlow` and `createHeaderContentExpsFlow` functions
- **feat(pdf)**: Add experience-specific constants (`EXP_BOX_*`, `EXP_CHART_*`, `TIMELINE_*`) to `pdf.constants.ts`
- **feat(pdf)**: Add `selectedActivities` parameter to `AttestationPDFDocumentProps` and PDF generation flow
- **feat(pdf)**: Add `ExpPosition` type extending `ManualPosition` for experience box positioning
- **feat(pdf)**: Add date range formatting with arrow separator (→) and capitalized months
- **feat(pdf)**: Add duration badge with light green background and centered text for experience boxes
- **feat(pdf)**: Add non-breaking space in date formatting to prevent month/year line breaks

#### WEB [0.12]

- **feat(ui)**: Pass `selectedActivities` prop to `AttestationPreview` component in `Step2Content` for experiences flow
- **feat(ui)**: Update `AttestationPreview` to regenerate PDF when `selectedActivities` changes

### Changed

#### PDF [0.9]

- **refactor(pdf)**: Refactor `SkillPosition` and `ExpPosition` types to extend `ManualPosition` base type, reducing redundancy
- **refactor(pdf)**: Extract flow-specific content generation logic from `createAttestationPDFDocument` to `flowContent.ts`
- **refactor(pdf)**: Extract flow-specific header generation logic to separate functions in `headerContent.ts`
- **refactor(pdf)**: Rename `step2Content` and `step3Content` to `step2ContentSkills` and `step3ContentSkills` in `createAttestationPDFDocument`
- **refactor(pdf)**: Condition PDF content generation based on `selectedFlow` (skills or experiences)
- **refactor(pdf)**: Update `createAttestationPDFDocument` to calculate `expPositions` and pass to `getContentForExpsFlow`
- **refactor(pdf)**: Update `skillsChartUtils.ts` to use shared `getLShapePoints` utility from `lineGraphicsUtils.ts`
- **refactor(pdf)**: Optimize `headerContent.ts` by extracting reusable utility functions to `headerContentUtils.ts`
- **refactor(pdf)**: Update experiences flow header to use full-width separators spanning entire page width
- **refactor(pdf)**: Update experiences flow header to conditionally display right column items (address, web, networks) with dynamic margins
- **refactor(pdf)**: Update date formatting to use arrow separator (→) instead of hyphen (-) for date ranges
- **refactor(pdf)**: Update duration badge text styling to use `AzeretMedium` font and primary color
- **refactor(pdf)**: Update date text styling in experience boxes to use `AzeretMedium` font instead of bold
- **refactor(pdf)**: Update experience box positioning calculation to use timeline center as reference point
- **refactor(pdf)**: Update `calculateHeaderHeight` to account for experiences flow header structure

### Fixed

#### PDF [0.9]

- **fix(pdf)**: Fix experience boxes not appearing in PDF preview when activities are selected
- **fix(pdf)**: Fix missing connecting lines between timeline bar and experience boxes
- **fix(pdf)**: Fix duration badge text vertical centering using calculated offset
- **fix(pdf)**: Fix date range formatting to prevent year wrapping to new line by using non-breaking space
- **fix(pdf)**: Fix experience chart line width by using `lineColor` instead of `color` in canvas elements
- **fix(pdf)**: Fix experience box Y position calculation to avoid double-adding `barY` offset
- **fix(pdf)**: Fix profile picture/user logo rendering above separator line in experiences flow header
- **fix(pdf)**: Fix user logo SVG inner color to be white (background.default) instead of transparent
- **fix(pdf)**: Fix phone number margin placement (bottom margin on email instead of left margin on phone)
- **fix(pdf)**: Fix website overflow in experiences flow header by setting fixed width for right column
- **fix(pdf)**: Fix conditional margins for right column items (website and Instagram) based on subsequent items presence

### Removed

#### PDF [0.9]

- **remove(pdf)**: Remove duplicate text element in duration badge (was rendered twice)

## [0.11.0-web+pdf.0.8] - 2026-01-14

### Known Issues

#### WEB [0.11]

- **known-issue(ui)**: Firefox displays PDF viewer toolbar in iframe preview despite `#toolbar=0` parameter. Firefox ignores these URL parameters in its native PDF viewer. Workaround: Use Chrome/Edge for optimal preview experience.

#### PDF [0.8]

- **wip(pdf)**: Header alignment issue - logo and "Attestation de contribution" title alignment needs adjustment after recent layout modifications.

### Added

#### WEB [0.11]

- **feat(ui)**: Add floating fullscreen preview button using `StepperScrollButton` component with `Fullscreen` icon positioned bottom-left
- **feat(ui)**: Enhance `StepperScrollButton` to support custom icons, click handlers, and dynamic positioning (left/right)
- **feat(ui)**: Add `fullScreen` prop to `Modal` component for fullscreen PDF preview viewer experience
- **feat(ui)**: Add `fullscreen` prop to `AttestationPreview` component to support fullscreen and regular preview modes
- **feat(ui)**: Add "link" variant to `Button` component for link-style buttons with underline and transparent background

#### PDF [0.8]

- **feat(pdf)**: Add QR code image as third column in PDF header (from `public/qrcode.png`)
- **feat(pdf)**: Add `SUBTITLE_FONT_SIZE` constant (20pt) for consistent subtitle styling across PDF steps
- **feat(pdf)**: Add QR code image loading in `generateAttestationPdf` service
- **feat(pdf)**: Add `qrcodeImage` parameter to `HeaderContentParams` and `AttestationPDFDocumentProps` types

### Changed

#### WEB [0.11]

- **refactor(ui)**: Replace static "view preview" button with floating `StepperScrollButton` in `NavigationStepper` for better UX
- **refactor(ui)**: Update `StepperScrollButton` to be reusable for both scroll navigation and custom actions (preview button)
- **refactor(ui)**: Enhance `StepperScrollButton` with `left`, `icon`, `onClick`, `tooltipText`, and `ariaLabel` props for flexibility
- **refactor(ui)**: Update `Modal` component to support `fullScreen` prop with custom styling (no border radius, full viewport, custom close button positioning)
- **refactor(ui)**: Update `AttestationPreview` to support both fullscreen and regular preview modes with different page heights (`PREVIEW_PAGE_HEIGHT_FULLSCREEN` vs `PREVIEW_PAGE_HEIGHT`)
- **refactor(ui)**: Update `Button` component to support "link" variant with underline styling, transparent background, and hover effects
- **refactor(ui)**: Update `Button` component color prop to support "primary", "tertiary", and "error" colors for outlined and contained variants
- **refactor(ui)**: Update `LanguageSwitcher` component
- **refactor(ui)**: Remove all PDF caching mechanisms from `AttestationPreview` and `AttestationSuccessModal` to fix preview flashing issues
- **refactor(ui)**: Simplify `AttestationPreview` by removing cache-related logic (`usePdfCache`, throttling, data hashing)
- **refactor(ui)**: Update `NavigationStepper` to integrate floating preview button and fullscreen modal

#### PDF [0.8]

- **refactor(pdf)**: Update header layout to support three-column structure (user info, address/social, QR code) with 40px gap between columns
- **refactor(pdf)**: Adjust header column widths: first column reduced to 200px, second column set to 173px, third column (QR code) set to 90px
- **refactor(pdf)**: Update header logo row to display logo and "Attestation de contribution" title on same line with space-between alignment
- **refactor(pdf)**: Update footer pagination margin for pages 2+ (added 60px top margin to position pagination lower on page)
- **refactor(pdf)**: Update header to display first name and last name on separate lines
- **refactor(pdf)**: Remove redundant `layout` property from header table (column separators handled by `border` properties)

### Fixed

#### WEB [0.11]

- **fix(ui)**: Fix PDF preview flashing issue by removing all caching mechanisms that caused regeneration delays
- **fix(ui)**: Fix `StepperScrollButton` positioning when used as custom button (left positioning support)
- **fix(ui)**: Fix `Modal` close button visibility in fullscreen mode with custom background color and positioning
- **fix(ui)**: Fix `AttestationPreview` page height calculation for fullscreen mode using `PREVIEW_PAGE_HEIGHT_FULLSCREEN` constant

#### PDF [0.8]

- **fix(pdf)**: Fix header layout redundancy by removing unnecessary `layout` property in table structure
- **fix(pdf)**: Fix pagination positioning on pages 2+ by adjusting top margin from 0 to 60px

### Removed

#### WEB [0.11]

- **remove(ui)**: Remove `usePdfCache` hook and all caching logic from PDF generation flow
- **remove(ui)**: Remove PDF blob caching, profile picture caching, and ECharts image caching
- **remove(ui)**: Remove throttling mechanisms from `AttestationPreview` component

## [0.10.0-web+pdf.0.7] - 2026-01-13

### Added

#### PDF [0.7]

- **feat(pdf)**: Extract PDF generation orchestration into dedicated `generateAttestationPdf` service following hexagonal architecture
- **feat(pdf)**: Separate PDF document definition creation into `createAttestationPDFDocument` service
- **feat(pdf)**: Improve font loading utilities for pdfmake 0.3.2 compatibility with VFS management
- **feat(domain)**: Create `recap.types.ts` to centralize recap-related types (RecapStepBoxProps, Step1RecapProps, Step2RecapProps, Step3RecapProps, Step4RecapProps, Step5RecapProps)
- **feat(domain)**: Rename `skill.types.ts` to `attestation.types.ts` for better type organization

#### WEB [0.10]

- **feat(ui)**: Add AttestationSuccessModal component for post-creation success dialog with download, QR code, and email options
- **feat(ui)**: Add Modal component (basic) for reusable modal dialogs with consistent styling
- **feat(ui)**: Add CustomTooltip component for consistent tooltip styling across the application
- **feat(ui)**: Add StepperScrollButton component for floating scroll navigation in Step 2
- **feat(i18n)**: Add translations for success modal (title, descriptions, button labels)
- **feat(i18n)**: Add translations for scroll button tooltips and aria labels
- **feat(i18n)**: Add translations for user data fields info tooltips

### Changed

#### PDF [0.7]

- **refactor(pdf)**: Refactor PDF generation architecture:
  - Move PDF generation logic from `AttestationPreview` to `generateAttestationPdf` service
  - Separate concerns: `generateAttestationPdf` handles orchestration and data preparation, `createAttestationPDFDocument` assembles document definition
  - Improve font loading with proper VFS initialization for pdfmake 0.3.2
  - Update font utilities to use `addVirtualFileSystem` and `virtualfs.writeFileSync` APIs
- **refactor(pdf)**: Improve `AttestationPreview` component to act as UI adapter, calling PDF generation service
- **refactor(pdf)**: Update PDF services exports and organization
- **refactor(domain)**: Update PDF types to support new service architecture with `skillsChartImage` prop
- **refactor(domain)**: Reorganize domain types:
  - Move recap-related types from `attestation.types.ts` to dedicated `recap.types.ts` file
  - Rename `skill.types.ts` to `attestation.types.ts` for better semantic naming
  - Update all imports to reflect new type file structure
- **refactor(ui)**: Reorganize component structure following hexagonal architecture:
  - Move components from `basic/` to `composite/` when they depend on other basic components
  - Create `index.ts` files for `basic/` and `composite/` components for cleaner imports
  - Update all component imports to use index files
  - Move `StepperScrollButton` from `basic/` to `composite/` (depends on `CustomTooltip`)
  - Move `CardSelector` from `basic/` to `composite/` (depends on `CustomTooltip`)
  - Move `Header`, `AppLayout`, `NavigationStepper` to `composite/` folder

#### WEB [0.10]

- **refactor(ui)**: Refactor Button component API:
  - Remove `childClassStyle` prop in favor of native MUI `startIcon` and `endIcon` props
  - Group `width`, `padding`, and `alignSelf` into a single `layout` prop object for better API consistency
  - Remove `joy` variant (no longer used)
  - Maintain default values for `width` ("auto") and `padding` ("10px 20px")
- **refactor(ui)**: Enhance Modal component to support custom `maxWidth` (string) and `fullWidth` prop for flexible sizing
- **refactor(ui)**: Update AttestationSuccessModal to use `t.rich` for formatted text with bold styling for "Mes documents"
- **refactor(ui)**: Update CheckboxField to support `infoTooltipText` prop with CustomTooltip integration
- **refactor(ui)**: Update UserDataMainSection to display info tooltips for firstName and lastName fields
- **refactor(ui)**: Simplify step dependencies logic in Attestation component:
  - Remove complex state-saving/restoration logic
  - Implement strict reset policy: changing Step 2 (skills) resets Step 3 (activities), changing Step 3 (activities) resets Step 4 (comments)
- **refactor(ui)**: Update NavigationStepper to open AttestationSuccessModal on validation at last step
- **refactor(i18n)**: Update French translations to use French quotation marks (« ») for "Mes documents" in success modal
- **refactor(i18n)**: Remove unused "close" translation key from both locales

### Fixed

#### PDF [0.7]

- **fix(pdf)**: Fix font loading errors for pdfmake 0.3.2 by correctly initializing VFS with `addVirtualFileSystem` and `virtualfs.writeFileSync`
- **fix(pdf)**: Fix async PDF blob generation by using `getBlob()` as async function (pdfmake 0.3.x)
- **fix(pdf)**: Fix PDF preview loading state by properly handling async blob generation

#### WEB [0.10]

- **fix(types)**: Fix TypeScript errors related to JSX and module imports
- **fix(types)**: Fix `tsc --noEmit` to correctly check project without including generated files (exclude `.next` folder)
- **fix(types)**: Fix TypeScript errors for `StaticImageData` type in activity images utilities
- **fix(types)**: Fix type errors in recap components (Step3Recap) by ensuring Activity type includes all required properties
- **fix(lint)**: Fix ESLint errors (unused variables, deeply nested blocks, console statements)
- **fix(ui)**: Fix hydration mismatch error by reverting AppLayout import to direct import

#### WEB [0.10]

- **fix(ui)**: Fix Button component to properly handle default values for `width` and `padding` when using `layout` prop
- **fix(ui)**: Fix Modal component to correctly apply custom width values via `maxWidth` prop

### Removed

#### WEB [0.10]

- **remove(ui)**: Remove unused constants and comments from PDF utilities
- **remove(i18n)**: Remove unused "close" translation key from locales

### Chore

#### PDF [0.7]

- **chore(deps)**: Update pdfmake to version 0.3.2 for better VFS and async API support
- **chore(pdf)**: Clean up unused constants and comments in PDF utilities
- **chore(pdf)**: Remove debug console statements from font loading utilities

#### WEB [0.10]

- **chore(ui)**: Clean up unused imports and variables after component reorganization
- **chore(ui)**: Remove unnecessary comments and unused constants
- **chore(types)**: Update TypeScript configuration to exclude `.next` folder from type checking
- **chore(types)**: Update domain types exports to include new `recap.types` module

## [0.9.0-web+pdf.0.6] - 2026-01-12

### Added

#### PDF [0.6]

- **feat(pdf)**: Add comments content generation for step 4 with manager comments integration
- **feat(pdf)**: Add header icon utilities (createInstagramSvg, createLinkedinSvg, createLocationSvg, createWebsiteSvg) for dynamic icon rendering in PDF headers
- **feat(pdf)**: Add header utilities for improved header content generation with social networks and contact info
- **feat(pdf)**: Add image utilities for profile picture circular conversion and image processing
- **feat(pdf)**: Add Step 4 and Step 5 recap components for final review and validation
- **feat(pdf)**: Add comments content module for PDF comment sections with quotes and author information
- **feat(ui)**: Add FieldDisplay component for displaying form fields in recap sections
- **feat(ui)**: Add CheckboxField component for checkbox field display with label
- **feat(ui)**: Add AddressCheckbox component for address field with checkbox support
- **feat(i18n)**: Add translations for comments, user data fields, recap sections, and PDF content
- **feat(data)**: Expand manager comments mock data with more diverse examples and scenarios
- **feat(assets)**: Add user profile picture asset (Yubel-user.png) for testing

#### WEB [0.9]

- **feat(ui)**: Improve pagination detection in AttestationPreview with viewport-based page calculation
- **feat(ui)**: Add data attribute (data-navigation-stepper) to NavigationStepper for scroll targeting
- **feat(ui)**: Enhance step navigation and flow management with better state handling
- **feat(ui)**: Add validation for Step 5 with comprehensive error checking
- **feat(ui)**: Improve step 6 recap navigation with edit capabilities

### Changed

#### PDF [0.6]

- **refactor(pdf)**: Improve header content generation with dynamic icons (Instagram, LinkedIn, Location, Website) and better layout
- **refactor(pdf)**: Enhance footer content with better formatting, separators, and metadata display
- **refactor(pdf)**: Optimize skills details content generation with improved positioning and spacing
- **refactor(pdf)**: Improve skills view content with better ECharts integration and chart rendering
- **refactor(pdf)**: Update skill box utilities for better reusability, consistency, and text truncation handling
- **refactor(pdf)**: Enhance skill positions configuration with better calculations and dynamic positioning
- **refactor(pdf)**: Improve PDF constants organization (PAGE_MARGIN_X, PAGE_WIDTH, HEADER constants) and add new layout constants
- **refactor(pdf)**: Optimize text utilities for better text rendering, truncation, and ellipsis handling
- **refactor(pdf)**: Enhance canvas utilities for better image processing and circular image conversion
- **refactor(pdf)**: Improve ECharts to PDF conversion utilities for better chart rendering
- **refactor(pdf)**: Update skills chart utilities for better visualization and donut chart generation
- **refactor(pdf)**: Enhance account icon utilities for better icon rendering and SVG generation
- **refactor(pdf)**: Improve AttestationPDFDocument with comments support, better step handling, and conditional content rendering
- **refactor(domain)**: Update PDF types (CommentsContentParams, HeaderContentParams) to support comments and enhanced content params
- **refactor(domain)**: Enhance skill types with better activity relations support and favorite status propagation

#### WEB [0.9]

- **refactor(ui)**: Improve AttestationPreview pagination logic with viewport-based page detection and better scroll handling
- **refactor(ui)**: Enhance Step 2, 3, 4, 5, and 6 content components with better state management and validation
- **refactor(ui)**: Update ActivitiesList, SkillsMainSection, and CommentsMainSection with improved filtering and selection logic
- **refactor(ui)**: Improve UserDataMainSection with better field handling, validation, and display components
- **refactor(ui)**: Enhance RecapSection with Step 4 and Step 5 recap components for better review experience
- **refactor(ui)**: Update ActivityCard, AdviceCard, and SelectedItem components with improved styling and interactions
- **refactor(ui)**: Improve Header, ContentHeader, and AttestationStepper components with better responsive design
- **refactor(ui)**: Enhance NavigationStepper with data attribute support for better scroll targeting
- **refactor(ui)**: Update AppLayout with better padding calculations for fixed header and stepper
- **refactor(ui)**: Improve theme configuration with PDF-specific colors (starColor, defaultSkillColor)
- **refactor(ui)**: Update global CSS with better styling and animations
- **refactor(ui)**: Improve Attestation page component with better flow management, validation, and state handling

### Fixed

#### PDF [0.6]

- **fix(pdf)**: Fix pagination calculation to prevent incorrect page detection
- **fix(pdf)**: Fix header margin and layout issues
- **fix(pdf)**: Fix skill box positioning and sizing
- **fix(pdf)**: Fix text truncation and ellipsis issues in skill boxes

#### WEB [0.9]

- **fix(ui)**: Fix pagination display in AttestationPreview (page X/Y)
- **fix(ui)**: Fix scroll behavior and page detection
- **fix(ui)**: Fix step navigation and flow transitions

### Removed

#### WEB [0.9]

- **remove(ui)**: Remove WarningModal component (replaced with better UX patterns)

### Chore

- **chore(data)**: Update manager comments JSON with expanded dataset
- **chore(assets)**: Add user profile picture asset (Yubel-user.png)
- **chore(types)**: Update domain types for better type safety

---

## [0.9.0-web+pdf.0.4] - 2026-01-09

### Added

#### PDF [0.4]

- **feat(pdf)**: Add step 3 content with skills details page and dynamic header
- **feat(pdf)**: Add textUtils and refactor skillBoxUtils for reusable skill box creation
- **feat(i18n)**: Add PDF translations and organize under pages.attestation.pdf namespace

#### Changed

#### PDF [0.4]

- **refactor(pdf)**: Split skills content into view and details components
- **refactor(pdf)**: Clean up types and improve code organization
- **refactor(pdf)**: Update footer to use PAGE_MARGIN_X constant
- **refactor(ui)**: Update components to use new PDF structure

#### Fixed

#### PDF [0.4]

- **fix(pdf)**: Fix header margin issue by removing duplicate margin in columns layout
- **fix(pdf)**: Remove duplicate PDF parsing and fix pagination flash issue

#### Chore

- **chore(data)**: Diversify skill associations in activities data

---

## [0.8.0-web+pdf.0.3]

### Added

#### PDF [0.3]

- **feat(pdf)**: Add ECharts integration for skills donut chart
- **feat(pdf)**: Add footer content with separator, description and metadata
- **feat(pdf)**: Add account icon SVG utilities
- **feat(i18n)**: Add days of mission translations

#### Changed

#### PDF [0.3]

- **refactor(pdf)**: Update skills content with ECharts hybrid rendering
- **refactor(pdf)**: Integrate ECharts chart and footer into attestation document
- **refactor(pdf)**: Reorganize constants into config folder with skill positions
- **refactor(pdf)**: Remove unused canvas utilities

#### Chore

#### PDF [0.3]

- **chore(deps)**: Add echarts dependency for PDF chart generation
- **chore(pdf)**: Update PDF preview and font configuration

---

## [0.8.0-web+pdf.0.2]

### Added

#### PDF [0.2]

- **feat(domain)**: Add PDF types following hexagonal architecture
- **feat(ui)**: Propagate favorite status from UI to PDF generation
- **feat(domain)**: Add favorite property to Skill type

#### Changed

#### PDF [0.2]

- **refactor(pdf)**: Simplify main PDF document using extracted modules
- **refactor(pdf)**: Extract content generators (header, skills) to separate modules
- **refactor(pdf)**: Extract utility functions (circle, color, star, canvas, text, fragments)
- **refactor(domain)**: Centralize PDF types in domain layer

#### Chore

#### PDF [0.2]

- **chore(pdf)**: Extract all magic numbers to constants file

---

## [0.8.0-web+pdf.0.1]

### Added

#### PDF [0.1]

- **feat(attestation)**: Add PDF generation with live preview and pagination

#### Changed

#### PDF [0.1]

- **refactor**: Update PDF document structure and remove unused fields
- **refactor**: Clean and optimize PDF generation code

---

## [0.8.0-web+pdf.0.0]

### Added

#### WEB [0.8]

- **feat(ui)**: Add recap components for Step 6
- **feat(ui)**: Add main sections for steps 4, 5, and 6
- **feat(ui)**: Add Step 4, 5, and 6 content components
- **feat(ui)**: Integrate steps 4, 5, 6 and add recap navigation
- **feat(ui)**: Enhance stepper and navigation components
- **feat(ui)**: Enforce 2-8 selection range and improve Step 3 logic
- **feat(ui)**: Add max selection limit and disabled state to lists
- **feat(i18n)**: Add translations for steps 4, 5, 6 and warning modal
- **feat(data)**: Add manager comments mock data
- **feat(domain)**: Add user data types and formatting service

#### Changed

#### WEB [0.8]

- **refactor(ui)**: Improve card components and theme
- **refactor(ui)**: Remove React. prefixes and unused imports
- **refactor(i18n)**: Rename comment to personalMessage in stepper

#### Style

#### WEB [0.8]

- **style(ui)**: Reduce height of filter select and search input to 40px

#### Chore

- **chore(data)**: Format softSkills.json

---

## [0.7.0-web+pdf.0.0]

### Added

#### WEB [0.7]

- **feat(ui)**: Add tooltips to card selector with translations
- **feat(filter)**: Integrate range slider for hours filtering in skills flow
- **feat(ui)**: Add RangeSlider component with min/max inputs
- **feat(ui)**: Improve scroll interactions and activities timeline
- **feat(ui)**: Improve skills list UI with accordion view
- **feat**: Add rich text formatting to step descriptions with bold text and star emoji

#### Changed

#### WEB [0.7]

- **refactor(ui)**: Extract filter and search components into reusable components
- **refactor**: Rename SkillsSection to Main2Section and improve step navigation
- **refactor**: Improve Step 2 and Step 3 components with optimizations and rich text formatting

---

## [0.6.0-web+pdf.0.0]

### Added

#### WEB [0.6]

- **feat(ui)**: Add step 3 with activities selection
- **feat(attestation)**: Add experiences flow and generic selection components
- **feat**: Add translations for activities and accordion features
- **feat**: Add activities data and images

---

## [0.5.0-web+pdf.0.0]

### Added

#### WEB [0.5]

- **feat(ui)**: Add step 2 content for skills selection
- **feat(ui)**: Add skills section components
- **feat(ui)**: Add SkillCard component
- **feat(i18n)**: Add skill-related translations
- **feat(theme)**: Add border color to palette
- **feat(domain)**: Add centralized skill types

#### Changed

#### WEB [0.5]

- **refactor(ui)**: Update components styling and behavior

#### Chore

- **chore(data)**: Add skills JSON data with attenuated colors
- **chore(assets)**: Add skill type icons

---

## [0.4.0-web+pdf.0.0]

### Added

#### WEB [0.4]

- **feat(attestation)**: Add attestation flow components and update UI
- **feat(ui)**: Add new basic components for attestation flow

#### Chore

- **chore**: Update dependencies
- **docs**: Update commit message to reflect all changes

---

## [0.1.0]

### Added

- Initial commit from Create Next App
- Header and Footer components
- Basic project structure
