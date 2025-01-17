- [How to develop Picturama](#how-to-develop-picturama)
  - [Directory structure](#directory-structure)
  - [Build from sources](#build-from-sources)
  - [Developing main process code](#developing-main-process-code)
  - [Debug main process](#debug-main-process)
  - [Unit tests](#unit-tests)
  - [UI Tester](#ui-tester)
  - [Add missing attributes to localization files](#add-missing-attributes-to-localization-files)
  - [Build distributable package](#build-distributable-package)
  - [I18N](#i18n)
  - [Icons](#icons)
  - [CSS naming conventions](#css-naming-conventions)



How to develop Picturama
========================



Directory structure
-------------------

    +-- dist/                 Build artifacts of the app (filled by `webpack`)
    +-- dist-package/         Build artifacts when creating distributable packages (filled by `electron-builder`)
    +-- doc/                  Resources used by documentation
    +-- migrations/           DB migration scripts
    +-- src/
        +-- app/              Code running in renderer electron process of main UI
        +-- background/       Code running in main electron process
        +-- common/           Shared code
        +-- package/          Resources needed for creating distributable packages (used by `electron-builder`)
        +-- static/           Static files to be copied directly to `dist`
        +-- test-jest/        Unit tests
        +-- test-ui/          Code running in renderer electron process of UI Tester
        +-- typings/          TypeScript type definitions
    +-- submodules/           Third-party projects fetched as git submodules
        +-- node-libraw/      Own fork of node-libraw
        +-- test-data/        Data used for testing



Build from sources
------------------

Prerequirements:

  - Install yarn (Mac OS: `brew install yarn` or just `npm install -g yarn`)
    - **Note:** It's important to use yarn instead of npm for
      [getting smaller distributable packages](https://github.com/electron-userland/electron-builder/issues/1147#issuecomment-276284477)
  - Mac OS: Install Xcode and start it once. You can close Xcode after the "required components" have been installed.

Fetch git submodules:

    git submodule update --init --recursive

Fetch dependencies and build and start Picturama:

    yarn
    yarn start

**In Windows Terminal**, !!! `make sure` the node version is 16.20.0

```
Error in bail mode: Error: callback(): The callback was already called.
    at context.callback (H:\myproject\github\picturama\node_modules\loader-runner\lib\LoaderRunner.js:106:10)
    at processTicksAndRejections (node:internal/process/task_queues:95:5) Error: callback(): The callback was already called.
    at context.callback (H:\myproject\github\picturama\node_modules\loader-runner\lib\LoaderRunner.js:106:10)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

$ MINGW64 /h/myproject/github/picturama (master)
$ nvm use 16.20.2
Now using node v16.20.2 (64-bit)

then 
> yarn
>
> yarn start

If you get an error with `node-gyp rebuild` then delete `~/.node-gyp` and try again:

    rm -rf ~/.node-gyp
    yarn

Development hotkeys:

  - Toggle developer tools: `Shift`+`Ctrl`+`I` (On Mac: `Cmd`+`Shift`+`I`)
  - Toggle UI tester:       `Shift`+`Ctrl`+`T` (On Mac: `Cmd`+`Shift`+`T`)
  - Reload UI:              `Shift`+`Ctrl`+`R` (On Mac: `Cmd`+`Shift`+`R`)



Developing main process code
----------------------------

If you change code that runs in the main process, you have to restart Picturama each time in order to see your changes.
Here's how you can use a watch build in order to reduce turnaround time:

1. Run watch build (in extra console):

        yarn run watch

2. Change your code.

3. Restart Picturama without building (since building is done by the watch):

        yarn run start-no-build



Debug main process
------------------

Main process debugging is already pre-configured in `.vscode/launch.json`.

So debugging is easy:

1. Open project in [VS Code](https://code.visualstudio.com/)

2. Start debugging in the Debug View



Unit tests
----------

Run unit tests:

    yarn run test

Run unit tests in watch mode:

    npm run test:watch

Run a single test in watch mode (example runs test `simple import`):

    npx jest -t 'simple import' --watch

Clean test cache:

    yarn run test:clean



UI Tester
---------

1. Run watch build:

        yarn run watch

2. Run Picturama (in extra console):

        yarn run start-no-build

3. Open the UI Tester: `Shift`+`Ctrl`+`T` (On Mac: `Alt`+`Cmd`+`T`)

4. Change some React code and save

5. Wait for the watch build to build the changes

6. Reload UI Tester: `Shift`+`Ctrl`+`R` (On Mac: `Cmd`+`Shift`+`R`)



Add missing attributes to localization files
--------------------------------------------

Add missing attributes to `src/common/i18n/text_*.ts`:

    yarn run i18n



Build distributable package
---------------------------

Build whole project from scratch:

    yarn run release

Build distributable package only (use existing `dist` folder):

    yarn run package

Only generate the package directory without really packaging it (This is useful for testing purposes):

    yarn run package-dir

**Hint:** In order check what is packed, add a `"asar": false` to the `build`-Object of `package.json`, then run
`yarn run package-dir` and check the folder `dist-package/mac/Picturama.app/Contents/Resources/app`

Cross-build linux package on macOS or Windows:

  1.  Run docker container:

          docker run --rm -ti \
          --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|  CIRCLETRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|  TRAVIS_BRANCHTRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|  STRIP|BUILD_') \
          --env ELECTRON_CACHE="/root/.cache/electron" \
          --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
          -v ${PWD}:/project \
          -v ${PWD##*/}-node-modules:/project/node_modules \
          -v ~/.cache/electron:/root/.cache/electron \
          -v ~/.cache/electron-builder:/root/.cache/electron-builder \
          electronuserland/builder

  2.  Build `dist-package/Picturama-xyz.AppImage` for Linux (in docker container):

          yarn && yarn run package

Cross-build windows package on macOS or Linux:

  - Log in to [AppYeyor](https://www.appveyor.com/)
  - Create a project for Picturama:
    - Type: "Git"
    - In Settings -> General set "Custom configuration .yml file name" to `https://raw.githubusercontent.com/picturama/picturama/master/appveyor.yml`
  - Click "New build" on the project details screen.

For more details see:

  - https://www.electron.build/multi-platform-build
  - https://github.com/appveyor/ci/issues/1089#issuecomment-264549196



I18N
----

The following files provide I18N:

  - `.github/workflows/codespell.yml` - The `text_*.ts` have to be excluded from codespell checks, since it only checks
    the English language.
  - `package.json` - Defines languagues available in mac package (see key `electronLanguages`)
  - `src/common/i18n/i18n.ts` - Defines available languages and provides the I18N logic
  - `src/common/i18n/text_*.ts` - Holds the I18N messages for each language



Icons
-----

Used icon libs:

  - [Blueprint icons](https://blueprintjs.com/docs/#icons) - using `@blueprintjs/icons`
  - [Font Awesome](https://fontawesome.com/icons) - using `app/ui/widget/icon/FaIcon`
  - [Material Design](https://material.io/tools/icons/) - using `react-icons/md`



CSS naming conventions
----------------------

Inspired by: [SUIT CSS naming conventions](https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md)

CSS example:

```css
// Component:
// - CamelCase uppercase
.MyComponent { ... }

// Status:
// - camelCase lowercase with prefix `is` or `has`
// - Always combined with another class
.MyComponent.isExpanded { ... }

// Component children:
// - camelCase lowercase with component name plus a minus as prefix
.MyComponent-header { ... }
```

less template:

```less
// Component
.MyComponent {
    ...

    // Status
    &.isExpanded {
        ...
    }
}

// Component child
.MyComponent-header {
    ...
}
```

HTML example:

```html
<div class="MyComponent isExpanded">
    <div class="MyComponent-header">...</div>
</div>
```
