#!/usr/bin/env node

const mdLinks = require("./src/md-links");

if((process.argv[3]==="--validate" && process.argv[4]==="--stats") || 
  (process.argv[3]==="--stats" && process.argv[4]==="--validate")){
  mdLinks.mdLinks(process.argv[2], {validate: true})
    .then((links)=>{
      let responseStats=mdLinks.statsLinks(links, {validate: true});
      console.log(`Total: ${responseStats.linksTotal}`);
      console.log(`Unique: ${responseStats.linksUnique}`);
      console.log(`Broken: ${responseStats.linksBroken}`)
    })
    .catch(console.error);
  }
else if(process.argv[3]==="--validate"){
  mdLinks.mdLinks(process.argv[2],{validate:true})
    .then((links) => {
      links=links.flat();
      links.forEach(function (link) {   
        console.log(`${link.file} ${link.href} ${link.status} ${link.statusText} ${link.text.substring(0,50)}`);
      }); 
    })
    .catch(console.error);
}else if(process.argv[3]==="--stats"){
  mdLinks.mdLinks(process.argv[2])
    .then((links) => {
      let responseStats=mdLinks.statsLinks(links);
      console.log(`Total: ${responseStats.linksTotal}`);
      console.log(`Unique: ${responseStats.linksUnique}`);
    })
    .catch(console.error);

}else {
  mdLinks.mdLinks(process.argv[2])
    .then((links) => {
      links=links.flat();
      links.forEach(function (link) {   
        console.log(`${link.file} ${link.href} ${link.text.substring(0,50)}`);
      }); 
    })
    .catch(console.error);
}

