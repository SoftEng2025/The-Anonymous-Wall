# Contributing to AnonyWall

Thank you for your interest in contributing! AnonyWall is a lightweight,
Firebase-powered community wall, and we welcome developers who want to
improve features, fix bugs, or help with documentation.

This guide explains how to contribute effectively and consistently.

------------------------------------------------------------------------

## 🧱 Project Principles

-   **Keep it simple.** Features should be lightweight and easy to use.
-   **Respect anonymity.** No feature should compromise users' privacy.
-   **Mobile-first.** UI changes must work cleanly on smaller screens.
-   **Quality matters.** Clean code, clear commits, and readable
    structure.

------------------------------------------------------------------------

## 🛠 How to Contribute

### 1. Fork the repository

Create your own copy of the project and work there.

### 2. Create a feature branch

Use descriptive names:

    feature/add-report-system
    fix/post-timestamp-bug
    docs/update-readme

### 3. Make your changes

Follow the project's coding standards: - Prefer clear, readable
JavaScript. - Keep components modular. - UI changes must be tested on
both desktop and mobile. - Firebase rules must remain secure.

### 4. Commit properly

Write meaningful commit messages:

    Add placeholder image for non-logged users
    Fix board filtering issue
    Improve footer layout

### 5. Open a Pull Request

Include: - **Summary of changes** - **Screenshots** (if UI-related) -
**Linked issue** (if applicable) - Mention anything that reviewers
should check or test.

A reviewer must approve the PR before merging.

------------------------------------------------------------------------

## ✔ Code Style

### JavaScript

-   Use async/await when possible.
-   Avoid deeply nested logic.
-   Use `const` and `let`, not `var`.
-   Add comments for complex logic.

### UI / HTML / CSS

-   Follow existing class naming pattern.
-   Keep styles modular.
-   Avoid inline CSS when possible.

------------------------------------------------------------------------

## 💬 Discussions & Suggestions

If you're proposing a feature:
1. Create a GitHub Discussion or Issue.
2. Describe the purpose, user benefit, and potential UI.
3. Wait for project maintainers to review before coding.

------------------------------------------------------------------------

## 🧪 Testing

Before submitting:
- Ensure all pages load without errors.
- Test
- posting, deleting, loading boards, and Firebase functions.
- logged-in and logged-out states.
- Check mobile responsiveness.

------------------------------------------------------------------------

## 🔐 Security Guidelines

-   Do not expose API keys.
-   Do not bypass Firebase security rules.
-   Avoid logging sensitive information.
-   Report vulnerabilities privately to maintainers.

------------------------------------------------------------------------

## 📝 Documentation Improvements

Docs contributions are always welcome:
- README updates.
- Setup instructions.
- Feature explanations.

------------------------------------------------------------------------

## 🤝 Community Behavior

We follow respectful and constructive communication:
- No harassment or toxic behavior.
- Feedback must be objective.
- Help mentor new contributors when possible.

------------------------------------------------------------------------

If you need help getting started, open an issue - we're happy to assist!

Thanks again for contributing to **AnonyWall** 🚀
