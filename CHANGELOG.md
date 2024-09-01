# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog],
and this project adheres to [Semantic Versioning].

<!-- ## Unreleased -->

## [0.4.0] - 2024-09-02

### Added

- Reading composer.json for projects written in PHP
- Display the registry where documentation is located with a colored circle (red = npm / yellow = packagist)
- Add the ability to search documentation in the packagist's registry
- Adding a list of keywords that filter the search results with a specific registry
- Filter the list of documentation by registry at the click of a button below the search bar

### Fixed

- Fix reload command that not correctly refresh documentation list after installing or removing packages
- User can click on the navigation button in the search bar and switch to the search documentation list even if the button is disabled

## [0.3.0] - 2024-08-27

### Added

- Add a search bar to obtain the documentation of an non-installed package
- Random loading animation added when a search is launched
- Add a pinned documentation category

### Changed

- Get the documentation url, not the package home page
- Use VSCode's css variables for text color instead of tailwind's gray color
- Add a loader to the launch page

### Fixed

- Fix extension reset function
- Fix extension reload function

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
[0.2.1]: https://github.com/baptistelechat/codeX/releases/tag/v0.2.1
[0.3.0]: https://github.com/baptistelechat/codeX/releases/tag/v0.3.0
[0.4.0]: https://github.com/baptistelechat/codeX/releases/tag/v0.4.0
