// from https://github.com/DanWahlin/AngularIn20TypeScript/blob/master/gulpfile.config.js

'use strict';
var GulpConfig = (function () {
    function gulpConfig() {

        this.src      = 'src/';
        this.build    = 'build/';
        this.dist     = 'dist/';
        this.allts    = '*.ts';
        this.alljs    = '*.js';
        this.allminjs = '*.min.js';
        this.allhtml  = '*.html';
        this.typings  = 'typings/';

    }
    return gulpConfig;
})();
module.exports = GulpConfig;
