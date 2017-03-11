#!/usr/bin/env node
const myFlixService = require('./index');
const argv = require('yargs').argv
const spawn = require('cross-spawn');
const defined = require('defined');
const path = require('path');

const magnetURI = argv._[0];
const peerflixPath = path.join('.','node_modules','peerflix','app.js')
const castnowPath = path.join('.','node_modules','castnow','index.js')

function outputToPeerflix(magnetLink, subtitle) {
  if(defined(subtitle)){
    let sp = spawn('node', [peerflixPath, magnetLink, '-d', '-t', subtitle, '--vlc'], {
      stdio: 'inherit'
    });
  }else{
    outputToPeerflixNoSub(magnetLink);
  }
}

function outputToCastnow(magnetLink, subtitle) {
  if(defined(subtitle)){
    let sp = spawn('node', [castnowPath, magnetLink, '--subtitles', subtitle], {
      stdio: 'inherit'
    });
  }else{
    outputToCastnowNoSub(magnetLink);
  }
}

function outputToPeerflixNoSub(magnetLink) {
  let sp = spawn('node', [peerflixPath, magnetLink, '-d', '--vlc'], {
      stdio: 'inherit'
    });
}

function outputToCastnowNoSub(magnetLink) {
  let sp = spawn('node', [castnowPath, magnetLink], {
      stdio: 'inherit'
    });
}

(function run() {
  //if -n is no subs
  if (argv.n) {
    console.log('Streaming with no subs');
    console.log('Starting peerflix on VLC...this can take a minute');
    outputToPeerflixNoSub(magnetURI);
  }else{
    myFlixService.downloadSubtitles(magnetURI)
      .then(subtitle => {
        console.log("Got subtitles on: %s", subtitle);
        if (argv.c) {
          console.log('Starting castnow...this can take a minute');
          outputToCastnow(magnetURI, subtitle);
        } else {
          console.log('Starting peerflix on VLC...this can take a minute');
          outputToPeerflix(magnetURI, subtitle);
        }
      }, err => console.error("Error on app.js: %s", err));
  }
})()