#!/usr/bin/env node

const mdLinks = require("./src/md-links");
const chalk = require('chalk');

if((process.argv[3]==="--validate" && process.argv[4]==="--stats") || 
  (process.argv[3]==="--stats" && process.argv[4]==="--validate")){
  mdLinks.mdLinks(process.argv[2], {validate: true})
    .then((links)=>{
      links=links.flat(); //creacion de una matriz con todos los elementos concatenados recursivamente
      let responseStats=mdLinks.statsLinks(links, {validate: true});
      console.log(chalk.bold.green(`Total: ${responseStats.linksTotal}`));
      console.log(chalk.bold.blue(`Unique: ${responseStats.linksUnique}`));
      console.log(chalk.bold.red(`Broken: ${responseStats.linksBroken}`));
      console.log(chalk.bold.black.bgWhiteBright(`HTTP Response Status Codes`));
      console.log(chalk.bold.green(`- Information responses: ${responseStats.informationResponses}`));
      console.log(chalk.bold.green(`- Successful responses: ${responseStats.successfulResponses}`));
      console.log(chalk.bold.blue(`- Redirection messages: ${responseStats.redirectionMessages}`));
      console.log(chalk.bold.red(`- Client error responses: ${responseStats.clientErrorResponses}`));
      console.log(chalk.bold.red(`- Server error responses: ${responseStats.serverErrorResponses}`));
    })
    .catch(console.error);
  }
  else if(process.argv[3]==="--validate"){
    mdLinks.mdLinks(process.argv[2],{validate:true})
      .then((links) => {
        links=links.flat();
        links.forEach(function (link) {   
          console.log(`${chalk.bold.yellow(link.file)} ${chalk.bold.blue(link.href)} ${chalk.bold.bgRed(link.status)} ${chalk.bold.bged(link.statusText)} ${chalk.bold.cyan(link.text.substring(0,50))}`);
        }); 
      })
      .catch(console.error);
      
  }else if(process.argv[3]==="--stats"){
    mdLinks.mdLinks(process.argv[2])
      .then((links) => {
        links=links.flat();
        let responseStats=mdLinks.statsLinks(links);
        console.log(chalk.bold.green(`Total: ${responseStats.linksTotal}`));
        console.log(chalk.bold.yellow(`Unique: ${responseStats.linksUnique}`));
      })
      .catch(console.error);
  
  }else {
    mdLinks.mdLinks(process.argv[2])
      .then((links) => {
        links=links.flat();
        links.forEach(function (link) {   
          console.log(`${chalk.bold.yellow(link.file)} ${chalk.bold.blue(link.href)} ${chalk.bold.red(link.text.substring(0,50))}`);
        }); 
      })
      .catch(console.error);
  }
  