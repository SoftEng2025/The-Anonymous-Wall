# AI Development Guidelines (Project Constitution)

This document serves as the primary rule set for all AI agents working on this codebase. Read this before planning or executing any tasks.

## 1. Folder Architecture
### The "Folder-per-File" Rule
* **Strict Rule:** This project uses a modular folder structure for both Pages and Components.
* **Do not** create loose `.jsx` or `.css` files in `src/pages` or `src/components`.
* **Correct Structure:**
    ```text
    src/pages/About/
        ├── About.jsx
        ├── About.css
        └── index.js
    ```
* **Incorrect Structure:**
    ```text
    src/pages/About.jsx  <-- FORBIDDEN
    ```

### File Naming
* Keep the main component file named after the component (e.g., `About.jsx`).
* **Do not** rename the main component file to `index.jsx`.

## 2. Imports & Barrel Files
* **Mandatory Barrel Files:** Every component folder must contain an `index.js` file that exports the component.
    * *Content:* `export { default } from './ComponentName';`
* **Import Style:** Always use "clean imports" that point to the folder, not the file.
    * ✅ **Good:** `import About from './pages/About';`
    * ❌ **Bad:** `import About from './pages/About/About';`
    * ❌ **Bad:** `import About from './pages/About/index';`

## 3. CSS Strategy & Maintainability
* **Size Limit:** No single CSS file should exceed **100 lines**.
* **Modularization:** If a CSS file grows too large, refactor it into "partials" based on the UI section (e.g., `AboutHeader.css`, `AboutGrid.css`) and import them into the main stylesheet or component.
* **Sanity Checks:** Before editing any CSS:
    1. Scan for duplicate rules or conflicting class names.
    2. Ensure syntax is valid (brackets closed, semicolons present).
* **Colocation:** CSS files must always live in the same folder as the Component that uses them.

## 4. General Coding Standards
* **React Style:** Prefer functional components with Hooks.
* **Safety:** Do not delete comments marked with `TODO:` or `IMPORTANT`.
* **Refactoring:** When moving files, always perform a project-wide scan to update import paths in `App.jsx`, `main.jsx`, and sibling components.