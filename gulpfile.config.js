// from https://github.com/DanWahlin/AngularIn20TypeScript/blob/master/gulpfile.config.js

'use strict';
var GulpConfig = (function () {
    function gulpConfig() {

    this.source   = 'src/';
    this.build    = 'build/';
    this.dist     = 'dist/';
    this.allts    = '**/*.ts';
    this.alljs    = '**/*.js';

    }
    return gulpConfig;
})();
module.exports = GulpConfig;
