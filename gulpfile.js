'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');

build.lintCmd.enabled = false;
build.addSuppression(/Warning/gi);

build.initialize(gulp);

gulp.task('serve', gulp.series('serve-deprecated'));
