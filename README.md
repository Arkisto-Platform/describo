> ## **If you're not a developer you should probably get a pre-built bundle from: [https://arkisto-platform.github.io/describo/](https://arkisto-platform.github.io/describo/)**

# describo

Describo is a tool to describe and package data. It is a desktop app that runs on your Mac, Windows or Linux computer. You point it at a directory and it will allow you to describe the data therein as a `Dataset` using the [RO-Crate Standard](https://researchobject.github.io/ro-crate/1.0/). RO-Crate uses a linked data approach to metadata - in describing your Dataset Data Item you will be able to add properties such as `author` - where the value is not just a string, but a Contextual Item - a `Person` - which in turn may link to other Contextual Items.

We do not have tutorial documentation yet but would be interested to hear what people make of the tool anyway.

If you follow the instructions below to run in a dev environment an application will start on your computer.

- [describo](#describo)
  - [Technology](#technology)
  - [Running the development environment](#running-the-development-environment)
  - [Tests](#tests)
  - [Repository Structure](#repository-structure)
  - [Building a release](#building-a-release)
  - [Updating the github pages site](#updating-the-github-pages-site)

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

See the [wiki](https://github.com/UTS-eResearch/describo/wiki/build-a-release)

## Updating the github pages site

See the [wiki](https://github.com/UTS-eResearch/describo/wiki/updating-github-pages)
