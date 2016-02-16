[![devDependency Status](https://david-dm.org/nlesc-sherlock/chicago/dev-status.svg)](https://david-dm.org/nlesc-sherlock/chicago#info=devDependencies)


**Usage (Linux Ubuntu)**

```sh
# use package manager to install git
sudo apt-get install git

# make a local copy of this repository
git clone https://github.com/nlesc-sherlock/chicago.git

# change into chicago directory
cd chicago

# install curl
sudo apt-get install curl

# add new PPA and install nodejs version from it, not from the Ubuntu repo.
# Do not do sudo apt-get install npm
sudo curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get update
sudo apt-get install nodejs

# we'll need to compile some stuff later, so install g++ and make
sudo apt-get install g++
sudo apt-get install make

# globally install typescript and tsd
sudo npm install --global typescript
sudo npm install --global tsd

# globally install the bower dependency manager
sudo npm install --global bower

# globally install the build automation tools gulp
sudo npm install --global gulp

# run npm install, bower install, tsd install through one command
npm run deploy-dev

# build and serve the build directory with
gulp dev-watch

# after running a gulp dev-watch, open up a browser and navigate 
# to http://localhost:3000/ to inspect the website. You've been served!

```



