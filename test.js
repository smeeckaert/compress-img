"use strict";
var Imagemin = require('imagemin');
var filesize = require('file-size');
var jpegoptim = require('imagemin-jpegoptim');
var fs = require('fs');
var glob = require('glob');
var startTime = Date.now();

var spawn = require('child_process').spawn;

glob("*.jpg", {}, function (er, files) {

    for (var i = 0; i < files.length; i++) {
        try {
            console.log("Compress SH " + files[i]);
            var cp = spawn("./no-node.sh", [files[i]]);
            var cp = spawn("./updated-optim.sh", [files[i]]);

            cp.on('close', function (code) {
                if (code) {
                    console.log("Error " + code);
                    return;
                }

                console.log("Done");
            });
        } catch (e) {
            console.log(e);
        }
    }

});

new Imagemin()
    .src("*.jpg")
    .dest("lossless")
    .use(Imagemin.jpegtran())
    .run(function (err, files) {
        var endTime = Date.now();
        console.log("Optimization took  " + (endTime - startTime) + "ms ");
        compare('lossless');
        compare('lossless-sh');
        compare('kraken-lossless');

    });

new Imagemin()
    .src("*.jpg")
    .dest("lossy")
    .use(jpegoptim({max: 85}))
    .run(function (err, files) {
        var endTime = Date.now();
        console.log("Optimization took  " + (endTime - startTime) + "ms ");
        compare('lossy');
        compare('lossy-sh');
        compare('lossy-opti-sh');
        compare('kraken-lossy');
    });

function compareFile(folder, filename) {
    fs.stat(filename, function (e, original) {
        fs.stat(folder + '/' + filename, function (e, compress) {
            if (!compress) {
                return;
            }
            var percent = Math.floor((compress.size / original.size) * 100)
            console.log("Comparison " + folder);
            console.log(filename + " Original " + filesize(original.size).human() + " Compressed " + filesize(compress.size).human() + " (" + percent + "% size)");
        });
    });
}

function compare(folder) {
    glob("*.jpg", {}, function (er, files) {
        for (var i = 0; i < files.length; i++) {
            compareFile(folder, files[i]);
        }
    });
}