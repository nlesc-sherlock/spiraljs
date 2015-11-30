[![devDependency Status](https://david-dm.org/nlesc-sherlock/chicago/dev-status.svg)](https://david-dm.org/nlesc-sherlock/chicago#info=devDependencies)


**Usage (Linux Ubuntu)**

```sh
# use package manager to install git
sudo apt-get install git

# make a local copy of this repository
git clone https://github.com/nlesc-sherlock/chicago.git

# install nvm somehow, e.g. following these instructions: 
# (http://www.liquidweb.com/kb/how-to-install-nvm-node-version-manager-for-node-js-on-ubuntu-14-04-lts/

# install and start using the latest stable version of node.js
nvm install stable

# the npm install is local to the terminal it was installed in

# verify what version of node you are running:
nvm current

# check available version of npm with 
nvm ls

# you can also check the version of nvm itself, using 
nvm --version

# let the recently loaded node package manager install the project's dependencies as 
# specified in package.json:
npm install

# one of the things that should now be installed, is the build system 'gulp'. build the project with 
gulp

# check what other tasks are available with 
gulp tasks

# build the project
gulp build

# you can also serve the build directory with
gulp serve-build

# after running a gulp serve-build, open up a browser and navigate 
# to http://localhost:8087/ to inspect the website. You've been served!

```



