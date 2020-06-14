const { src, dest, series } = require('gulp');
const replace = require('gulp-replace');
const INCOMING_HOOK_URL = process.env.SLACK_INCOMING_HOOK_URL

function buildCode() {
  return src('src/Code.js')
    .pipe(replace('SLACK_INCOMING_HOOK_URL', INCOMING_HOOK_URL))
    .pipe(dest('dist/'));
}

function copyAppsscriptJson() {
  return src('src/appsscript.json')
    .pipe(dest('dist/'));
}

exports.default = series(buildCode, copyAppsscriptJson);
