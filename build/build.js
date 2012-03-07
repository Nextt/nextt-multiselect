// settings
var FILE_ENCODING = 'utf-8';
var EOL = '\n';
var DIST_FILE_PATH = 'jquery.nexttmultiselect.js';
var DIST_MIN_FILE_PATH = 'jquery.nexttmultiselect.min.js';
var PACKAGE_JSON = 'build/package.json';

// setup
var fs = require('fs');
var uglify = require('uglify-js');
var jshint = require('jshint');


function concat(fileList, distPath) {
    var out = fileList.map(function(filePath){
            return fs.readFileSync(filePath, FILE_ENCODING);
        });
    fs.writeFileSync(distPath, out.join(EOL) , FILE_ENCODING);
    console.log(' '+ distPath +' concatenated.');
}


function minify(srcPath, distPath) {
    var jsp = uglify.parser;
    var pro = uglify.uglify;
    var ast = jsp.parse( fs.readFileSync(srcPath, FILE_ENCODING) );

    ast = pro.ast_mangle(ast);
    ast = pro.ast_squeeze(ast);

    fs.writeFileSync(distPath, pro.gen_code(ast), FILE_ENCODING);
    console.log(' '+ distPath +' minified.');
}



function lint(path, callback) {
    var buf = fs.readFileSync(path, FILE_ENCODING);
    // remove Byte Order Mark
    buf = buf.replace(/^\uFEFF/, '');

    jshint.JSHINT(buf);

    var nErrors = jshint.JSHINT.errors.length;

    if (nErrors) {
        console.log(' Found %j lint errors on %s. Won\'t continue.', nErrors, path);
        console.log(jshint.JSHINT.errors);
        process.exit(0);

    } else if (callback) {
        callback();
    }

    console.log('Lint OK.');
}


// RUN !!!

lint( 'src/nextt-multiselect.js' );

concat([
    'src/intro.js',
    'src/nextt-object.js',
    'src/nextt-multiselect.js',
    'src/outro.js'
], DIST_FILE_PATH);


minify(DIST_FILE_PATH, DIST_MIN_FILE_PATH);
