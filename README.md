- [![Build Status](https://travis-ci.org/nlesc-sherlock/spiraljs.svg?branch=master)](https://travis-ci.org/nlesc-sherlock/spiraljs)
- [![bitHound Overall Score](https://www.bithound.io/github/nlesc-sherlock/spiraljs/badges/score.svg)](https://www.bithound.io/github/nlesc-sherlock/spiraljs)
- [![bitHound Dependencies](https://www.bithound.io/github/nlesc-sherlock/spiraljs/badges/dependencies.svg)](https://www.bithound.io/github/nlesc-sherlock/spiraljs/master/dependencies/npm)
- [![bitHound Dev Dependencies](https://www.bithound.io/github/nlesc-sherlock/spiraljs/badges/devDependencies.svg)](https://www.bithound.io/github/nlesc-sherlock/spiraljs/master/dependencies/npm)
- [![bitHound Code](https://www.bithound.io/github/nlesc-sherlock/spiraljs/badges/code.svg)](https://www.bithound.io/github/nlesc-sherlock/spiraljs)

_this library is still a work in progress_

The sibling repository [https://github.com/nlesc-sherlock/spiraljs-demo](https://github.com/nlesc-sherlock/spiraljs-demo) contains various examples of how spiraljs can be used.

# codepen.io live examples

- [``BubleSpiral``](http://codepen.io/jspaaks/pen/mOjeda)

# Gallery (static images)

## ArcSpiral

![ArcSpiral-example.png](https://github.com/nlesc-sherlock/spiraljs/raw/master/docs/ArcSpiral-example.png "ArcSpiral-example.png")

## BubbleSpiral

### with ``color_map``

![BubbleSpiral-with-colormap-example.png](https://github.com/nlesc-sherlock/spiraljs/raw/master/docs/BubbleSpiral-with-colormap-example.png "BubbleSpiral-with-colormap-example.png")

### with ``radius_map``

![BubbleSpiral-with-radiusmap-example.png](https://github.com/nlesc-sherlock/spiraljs/raw/master/docs/BubbleSpiral-with-radiusmap-example.png "BubbleSpiral-with-radiusmap-example.png")

## LineSpiral

![LineSpiral-example.png](https://github.com/nlesc-sherlock/spiraljs/raw/master/docs/LineSpiral-example.png "LineSpiral-example.png")

## TimedBubbleSpiral

TODO

# Documentation for users

Installation of the library through ``npm`` in the normal way:
```
npm install spiraljs
```

See also:

- GitHub [repo](http://github.com/nlesc-sherlock/spiraljs-demo) with a website illustrating spiraljs;
- [code coverage](http://nlesc-sherlock.github.io/spiraljs/sites/coverage/remapped/src/index.html);
- [documentation](http://nlesc-sherlock.github.io/spiraljs/sites/tsdoc/);

# Documentation for developers

(this section describes the complete repository on GitHub, only part of which is included in the package on https://www.npmjs.com/package/spiraljs).

## Setting up, building and running

Get a local copy of the spiraljs repository using ``git``:

```bash
# use package manager to install git
sudo apt-get install git

# make a local copy of this repository
git clone https://github.com/nlesc-sherlock/spiraljs.git

# change into spiraljs directory
cd spiraljs
```

Download dependencies:

```bash
# Assuming you already have ``npm`` installed on your system, install with:
npm install
```

We use ``npm`` for the various build tasks (see ``scripts`` in ``packages.json`` for the complete list and their definitions). Here's a summary of the most relevant tasks (see also below for the dependency graph):

```bash
# make a distributable js file, spiral.js
npm run dist

# run the unit tests against the distributable
npm run test

# do all types of linting:
# tslint on the TypeScript from src/
# csslint on the CSS from src/
# jslint and jshint on the JS from test/
npm run lint

# clean up generated files
npm run clean

# do an npm run clean and additionally throw away any downloaded files
npm run purge

# generate the TypeDoc, inspect afterwards in a browser (output will be at <projectroot>/docs/sites/tsdoc)
npm run tsdoc

# generate code coverage in various formats. output will be at <projectroot>/docs/sites/coverage/, e.g.
# <projectroot>/docs/sites/coverage/remapped/ts/spiraljs/index.html
npm run cover

```


## How it all fits together

### General

So you wrote some **source code**. A **distributable** can be created from the source code. Distributables are great, because that's what people can use in their own websites later. However, distributables are only good if they work --you don't want to break other people's websites, now do you? So, the distributable needs to be tested using **unit tests**. For this you typically need to do two things: first, you need to be able to do **assertions**. Assertions help you test different kinds of equality (''is the test result what it is supposed to be?''). Secondly, you need a  **test runner**, i.e. something that runs the tests (and then, typically, reports on their results). Now that you have tests, you also want to generate **code coverage** reports. Code coverage helps to make transparent which parts of the code are covered by tests.

### In our case

- Our **source code** lives at ``src``. The meat of it is written in TypeScript 2.
- We create the **distributable** using ``npm run`` scripting, so there are no Gulp or Grunt files.
- We use **unit tests** written in the style of [``Jasmine``](http://jasmine.github.io/2.0/introduction.html) (i.e. ``describe()`` and ``it()``).
- Our **assertion** library is also [``Jasmine``](http://jasmine.github.io/2.0/introduction.html) (e.g. ``expect(actual).toEqual(expected)``).
- [Karma](https://karma-runner.github.io/1.0/index.html) is our **test runner**.
- We generate code coverage in different formats using [``karma-coverage``](https://www.npmjs.com/package/karma-coverage). However, this gives us code coverage of the (generated) JavaScript, which is not really what we're interested in. So we have [``remap-istanbul``](https://www.npmjs.com/package/remap-istanbul) figure out which parts of the generated JavaScript correspond with which parts of the (written) TypeScript.

Here is a visual representation of our build process:

![visual-description-of-setup.png](https://github.com/nlesc-sherlock/spiraljs/raw/master/docs/visual-description-of-setup.png "visual-description-of-setup.png")

and here is a callgraph generated from [package.json](https://github.com/nlesc-sherlock/spiraljs/blob/master/package.json) using [https://github.com/jspaaks/npm-scripts-callgraph](https://github.com/jspaaks/npm-scripts-callgraph):

![callgraph.png](https://github.com/nlesc-sherlock/spiraljs/raw/master/docs/callgraph.png "callgraph.png")





