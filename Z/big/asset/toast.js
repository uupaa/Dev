// toast.js: asset.json toaster
//
(function(global) {
var help = "                                                        \n\
    setup:                                                          \n\
        * install mimetype module                                   \n\
            %> npm install mime                                     \n\
                                                                    \n\
    usage:                                                          \n\
        * update public/asset/asset.json                            \n\
            %> node toast.js  -v  -d ../public/ -a ../public/asset/asset.json \n\
                                                                    \n\
        * update public_js/asset/asset.json                         \n\
            %> node toast.js  -v  -d ../public_js/ -a ../public_js/asset/asset.json \n\
                                                                    \n\
        * update demos/icons/asset/asset.json                       \n\
            %> node toast.js  -v  -d ../demos/icons/ -a ../demos/icons/asset/asset.json \n\
                                                                    \n\
        * update demos/icons/asset/asset.json                       \n\
            %> node toast.js  -v  -d ../ -a ./asset.json            \n\
                                                                    \n\
                                                                    \n\
    command line options:                                           \n\
        -v           | enable verbose mode                          \n\
        -d      PATH | root diretory of the asset files             \n\
        -a      PATH | file path of target asset.json               \n\
        -m           | asset.json minify (without spaces)           \n\
                                                                    \n\
        --verbose    | enable verbose mode                          \n\
        --dir   PATH | root diretory of the asset files             \n\
        --asset PATH | file path of target asset.json               \n\
        --minify     | asset.json minify (without spaces)           \n\
        --help       | show help                                    \n\
";

var fs      = require("fs");
var mime    = require("mime");
var crypto  = require("crypto");
var args    = parseCommandLineOptions();
var asset   = null;
var dir     = args.dir;
var error   = false;

if (args.help) {
    console.log(help);
    return;
}

asset = JSON.parse( fs.readFileSync(args.asset, "UTF-8") );

if (1) { // args.verbose
    console.log(process.argv[1], args.verbose ? "--verbose" : "",
                                 args.minify ? "--minify" : "",
                                 "--dir", args.dir,
                                 "--asset", args.asset);
}

for (id in asset.list) {
    var obj = asset.list[id];

    if (obj.url) {
        var filePath = dir + obj.url;

        if (fs.existsSync(filePath)) {
            var file = fs.readFileSync(filePath);
            var hash = crypto.createHash('md5').update(file).digest("hex");
            var mimetype = detectMimetype(filePath);

            obj.hash = hash;
            obj.type = mimetype;

            if (args.verbose) {
                console.log("url = " + filePath + ", hash = " + hash + ", type = " + mimetype);
            }
        } else {
            console.log("ERROR: path = " + filePath + ", url = " + obj.url + " is not exists");
            error = true;
            break;
        }
    }
}

if (!error) {
    var result_json = args.minify ? JSON.stringify(asset)
                                  : JSON.stringify(asset, "", 2);

    try {
        fs.writeFileSync( args.asset, result_json );

        if (args.verbose) {
            console.log( result_json );
        }
    } catch (err) {
    }
}

function detectMimetype(filePath) {
    var mimetype = mime.lookup(filePath);

    switch (mimetype) {
    case "text/css": break;
    case "image/png": break;
    case "image/gif": break;
    case "image/jpg":
    case "image/jpeg":
        mimetype = "image/jpeg";
        break;
    case "text/html":
        if (filePath.indexOf("/scene/") >= 0) {
            mimetype = "scene/html";
        }
        break;
    case "application/javascript":
        if (filePath.indexOf("/scene/") >= 0) {
            mimetype = "scene/class";
        }
    }
    return mimetype;
}

function parseCommandLineOptions() {
    // %> node toast.js  -v  -d ../ -a ./asset.json
    var argv = process.argv.slice(2); // [arg1, arg2, ...]
    var dir = "../";   // default dir
    var asset = "./asset.json"; // default asset.json file
    var verbose = false;
    var minify = false;
    var help = false;

    for (var i = 0, iz = argv.length; i < iz; ++i) {
        switch (argv[i]) {
        case "-d": case "--dir":     dir = argv[++i]; break;
        case "-a": case "--asset":   asset = argv[++i]; break;
        case "-v": case "--verbose": verbose = true; break;
        case "-m": case "--minify":  minify = true; break;
                   case "--help":    help = true; break;
        default:
            console.log(argv[i] + " is unknown option");
            return { help: true };
        }
    }

    // --- dir -> dir/ ---
    dir = dir.replace(/\/+$/, "");
    dir += "/";

    return { verbose: verbose, dir: dir, asset: asset,
             minify: minify, help: help };
}

})(this.self || global);

