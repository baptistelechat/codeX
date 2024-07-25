# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog],
and this project adheres to [Semantic Versioning].

## Unreleased

### Added

- Add a search bar to obtain the documentation of an non-installed package
- Use search bar to filter the list of documentation

### Changed

- Get the documentation url, not the package home page

## [0.2.1] - 2024-07-17

### Added

- Manage Radix-ui documentations by updating the url of each installed component

### Fixed

- Manage the list of documentations if the name has the same prefix
- Display error page if documentation page fails to load due to website security policy (X-Frame-Options)

## [0.2.0] - 2024-07-12

### Added

- Action items :
  - Open in default browser
  - Bookmark documentation for easier access in the future
  - Hide the desired documentation if the user doesn't think it's useful to display it
- Add possibility to reset preferences of the extension

### Changed

- Update "Add to favorites" icon
- Update GitHub favicon for git documentation
- Migrate many files from JavaScript to TypeScript

## [0.1.0] - 2024-06-27

### Added

- Display of official dependency websites after reading the package.json file
- Display of dependency name, available documentation version and short description if available
- Sorting in alphabetical order
- Adding a hover spotlight effect
- Adding two types of border depending on whether the tab is active or in the background
- Opening documentation in an editor side panel
- Display of a markdown interpreter for documentation hosted on GitHub
- Adding a footer to open documentation directly in the browser in the case of problems
- Add 3 action items in WIP mode

<!-- Links -->

[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html

<!-- Versions -->

[0.1.0]: https://github.com/baptistelechat/codeX/releases/tag/v0.1.0
[0.2.0]: https://github.com/baptistelechat/codeX/releases/tag/v0.2.0
