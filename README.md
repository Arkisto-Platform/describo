# describo

The tool to describe and package data.

-   [describo](#describo)
    -   [Technology](#technology)
    -   [Running the development environment](#running-the-development-environment)
    -   [Repository Structure](#repository-structure)
    -   [Building a release](#building-a-release)
        -   [Code signing](#code-signing)
        -   [Building MacOS releases](#building-macos-releases)
        -   [Building Windows releases](#building-windows-releases)
    -   [Publishing a release](#publishing-a-release)

## Technology

-   [ElectronJS](https://www.electronjs.org/)
-   [VueJS](https://vuejs.org/)
-   [ElementFE - component toolkit](https://element.eleme.io/#/en-US/component/installation)
-   [TailwindCSS](https://tailwindcss.com/docs/installation/)
-   [Fontawesome Free Icons](https://fontawesome.com/)
-   [rclone](https://rclone.org/)
-   [Jest - tests](https://jestjs.io/en/)

## Running the development environment

Install the packages and then start the dev env.

```
npm install
npm run develop
```

Hot updates are enabled so the app will reload when you save file changes.

## Tests

There are two way to run the tests:

-   `npm run test` to run the tests on demand
-   `npm run test-watch` to start the test server in watch mode and re-run tests on spec file changes.

DO:

-   create tests named as test-\*\*\*.spec.js
-   create the tests alongside the code being tested

## Repository Structure

The entry point to the Vue app is in `src/renderer/index.js`.
The `store` and `route` files are in that folder also. The
application components are in `src/components` whist the css
assets are in `src/assets` but since the app uses tailwindcss
you likely won't need to create any / many custom css classes.

## Building a release

You can build a release for testing by simply running one of the following commands (obviously choose the one for your platform)

-   Build for linux: `npm run build:linux`
-   Build for mac: `npm run build:mac`
-   Build for windows: `npm run build:win`

The built executable will be in the `dist` folder in the top level.

### Code signing

See https://www.electron.build/code-signing for information about code signing.

### Building MacOS releases

You will need an Apple developer certificate to sign the release and the application notarization is not yet set up so MacOS Catalina (latest) will not currently run the executable.

### Building Windows releases

Like the MacOS release a developer certificate is required to sign the app but (I think) Windows doesn't stop anyone running an unsigned application.

## Publishing a release

In order to publish a release you will first need a `Github Personal Access` token in order to push the release to the repo so create one if you don't already have one.

Then you can do `./publish.sh`. This will:

-   ask if you want to bump the major, minor, patch numbers
-   build the 3 distributables
-   publish the release to the `releases` page of the repo.

Once the release is published you then need to verify the draft and release it from the releases page.
