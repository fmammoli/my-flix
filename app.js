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
    let sp = spawn('node', [peerflixPath, magnetLink, '-d', '--vlc'], {
      stdio: 'inherit'
    });
  }
}

function outputToCastnow(magnetLink, subtitle) {
  if(defined(subtitle)){
    let sp = spawn('node', [castnowPath, magnetLink, '--subtitles', subtitle], {
      stdio: 'inherit'
    });
  }else{
    let sp = spawn('node', [castnowPath, magnetLink], {
      stdio: 'inherit'
    });
  }
}

myFlixService.downloadSubtitles(magnetURI)
.then(subtitle => {
  console.log("Got subtitles on: %s", subtitle);
  if(argv.c){
    console.log('Starting castnow...this can take a minute');
    outputToCastNow(magnetURI, subtitle);
  }else{
    console.log('Starting peerflix on VLC...this can take a minute');
    outputToPeerflix(magnetURI, subtitle);
  }
})