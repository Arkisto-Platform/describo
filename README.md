> ## **If you're not a developer you should probably get a pre-built bundle from: [https://arkisto-platform.github.io/describo/](https://arkisto-platform.github.io/describo/)**

# describo

Describo is a tool to describe and package research data and corresponding metadata following the [RO-Crate standard](https://researchobject.github.io/ro-crate/1.0/). You will start from a directory and then use Describo to describe the data therein as a `Dataset`, including metadata on the "who, what and where" properties such as `author` - where the value is not just a string, but a Contextual Item - a `Person` - which in turn may link to other Contextual Items. Describo runs as a desktop app on your Mac, Windows or Linux computer. There is also a [version that can be installed as a web application](https://arkisto-platform.github.io/describo-online/), e.g., to make it available from your servers for all the researchers at your institution.  

We do not have yet a formal tutorial documentation for developers but would be interested to hear what people make of the tool anyway. Here we provide some instructions to run it in a dev environment so an application will start on your computer. 

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
