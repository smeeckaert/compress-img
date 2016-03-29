"use strict";
var Imagemin = require('imagemin');
var filesize = require('file-size');
var jpegoptim = require('imagemin-jpegoptim');
var fs = require('fs');
var glob = require('glob');
var startTime = Date.now();
new Imagemin()
    .src("*.jpg")
    .dest("lossless")
    .use(Imagemin.jpegtran())
    .run(function (err, files) {
        var endTime = Date.now();
        console.log("Optimization took  " + (endTime - startTime) + "ms ");
        compare('lossless');

    });

new Imagemin()
    .src("*.jpg")
    .dest("lossy")
    .use(jpegoptim({max: 85}))
    .run(function (err, files) {
        var endTime = Date.now();
        console.log("Optimization took  " + (endTime - startTime) + "ms ");
        compare('lossy');

    });

function compareFile(folder, filename) {
    fs.stat(filename, function (e, original) {
        fs.stat(folder + '/' + filename, function (e, compress) {
            var percent = Math.floor((compress.size / original.size) * 100)
            console.log(filename + " Original " + filesize(original.size).human() + " Compressed " + filesize(compress.size).human() + " (" + percent + "% size)");
        });
    });
}

function compare(folder) {
    console.log("Comparison " + folder);
    glob("*.jpg", {}, function (er, files) {
        for (var i = 0; i < files.length; i++) {
            compareFile(folder, files[i]);
        }
    });
}