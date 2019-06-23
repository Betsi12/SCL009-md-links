#!/usr/bin/env node

const mdLinks = require("./md-links");

mdLinks.mdLinks(process.argv[2],false).then((links)=>{
  links.forEach(function (link) {
    console.log(link);
  });
});