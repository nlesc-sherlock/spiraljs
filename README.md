[![devDependency Status](https://david-dm.org/nlesc-sherlock/chicago/dev-status.svg)](https://david-dm.org/nlesc-sherlock/chicago#info=devDependencies)


# Setting up the development environment (Linux Ubuntu)

The Chicago visualization project is written in TypeScript, and uses a variety
of TypeScript and JavaScript related tools in its build and run-time environment.
All of these need to be installed for the program to work.

## JavaScript runtime environment: Node.js

The base of the development environment is Node.js. Node.js is an application
platform for JavaScript. Think of it as Tomcat or Apache+mod_php, but for
JavaScript instead of Java or PHP. Node.js consists of Google's V8 JavaScript
engine, with a fairly simple web application framework on top.

Node.js comes with a package manager for installing add-on packages, which is
called `npm`. Don't confuse `npm` with `nvm`, which is used to install and
keep up-to-date Node.js itself. We will not use `nvm` here, since our platform
(Ubuntu) already has a package manager (`apt`).

The build tools we use are written in JavaScript, and run on top of Node.js.
The Chicago visualization web site itself is served by Browsersync, which
also runs on top of Node.js. So we need Node.js first. The current Long Term
Support version is 4.3.1; and the below instructions will install that. More
detailed instructions, also for other Linux distributions, are [available
at the Node.js website](https://nodejs.org/en/download/package-manager/).

```sh
# install curl
sudo apt-get install curl

# add new PPA and install nodejs version from it, not from the Ubuntu repo.
# Do not do sudo apt-get install npm
sudo curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get update
sudo apt-get install nodejs
```

Some of the tools we will install later contain V8 plugins that are written
in C++. To be able to install these, we'll need a C++ compiler and `make`.

```sh
sudo apt-get install g++
sudo apt-get install make
```

## TypeScript

TypeScript is a typed superset of JavaScript, which is compiled into
JavaScript for execution on Node.js or inside a browser. So to use it, we
need at least a compiler, which is available through `npm`. The following
command will install it globally (for all users on the system). `npm` can
also install packages locally (within your project directory), which is
used when installing packages containing dependencies. For tools, a global
install is recommended.

```sh
sudo npm install --global typescript
```

To be able to use existing JavaScript libraries, TypeScript type definitions
are needed for them so that the TypeScript compiler can check that we call
them in the correct way. These are installed through a package manager called
`tsd`. `tsd` obtains the type definitions from a Github repository called
DefinitelyTyped.

```sh
sudo npm install --global tsd
```

Finally, we use the static analysis tool `tslint` for checking our code.

```sh
sudo npm install --global tslint
```

## Build tools

We use the `gulp` build automation tool for building the project, and
`bower` for dependency resolution.

```sh
# globally install the bower dependency manager
sudo npm install --global bower

# globally install the build automation tools gulp
sudo npm install --global gulp
```

You are by now probably confused about what installs what and what runs on
top of what. We have now used four different ways of installing software:
`apt`, `npm`, `tsd` and `bower`. Each has a different role.

`apt` is the Ubuntu package manager, and was used to install Node.js,
including `npm`, on top of Ubuntu, plus `g++` and `make` for building V8
extensions. It installs packages directly into the file system.

`npm` is the Node.js package manager. It was used to install the
development tools for TypeScript, which happen to run on Node.js. `npm`
packages that are installed globally end up in the file system as well
(under `/usr`). Locally installed `npm` packages are put in `node_modules/`
in your project directory.

`npm` is also used to install local components of these. For example, `gulp`
build files are scripts that use gulp as a library, which therefore needs
to be installed locally. `gulp` is also the command used to start the build
process, and that command is only in your path if `gulp` is installed
globally.

`tsd` is a TypeScript tool that gets type definitions for JavaScript
libraries, enabling their use with TypeScript. These end up in `typings/`
in your project directory.

`bower` finally is a tool for automatically managing dependencies in the
client-side code of a project. Our visualizations run `d3` (data-driven DOM
modification), `leaflet` (map display library) and `moment` (date library)
on the client. `bower` collects these from a variety of sources and puts
them into `bower_components/`, from where they can be served by a web server
together with the rest of the web site.

# Getting the source

The Chicago code is on Github. You can clone it using:

```sh
# use package manager to install git
sudo apt-get install git

# make a local copy of this repository
git clone https://github.com/nlesc-sherlock/chicago.git

# change into chicago directory
cd chicago
```

# Setting up, building and running

After getting the source, three things need to be done: `npm` needs to install
local components of the build tools, `bower` needs to fetch dependencies of
our code, and `tsd` needs to get the typescript annotations for those. You can
do all of these in one go using:

```sh
# run npm install, bower install, tsd install through one command
npm run deploy-dev
```

Next, the software needs to be built. This is done using `gulp`, which is set
up to build and run the project in a single command:

```sh
# build and serve the build directory with
gulp dev-watch
```
If a browser window does not pop up automatically, open one yourself and browse
to http://localhost:3000/ to inspect the website. You've been served!




