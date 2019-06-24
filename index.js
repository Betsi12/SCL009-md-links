#!/usr/bin/env node

const mdLinks = require("./md-links");

mdLinks.extractLinksFile(process.argv[2])
.then((links)=>{
  links.forEach(function (link) {
    /*formato solicitado  de impresión texto maximo 50 carácteres*/
    console.log(`${link.file} ${link.href} ${link.text.substring(0,50)}`);
  }); 
  
})
.catch(console.error);

let url = "https://www.google.com";
mdLinks.validateLinks(url)
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.log(error);
  });
s