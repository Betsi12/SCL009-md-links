const fs = require('fs')
const markdownLinkExtractor = require('markdown-link-extractor');

const mdLinks = (path,options)=>{
    return new Promise((resolve,reject)=>{
        try{
            let markdown = fs.readFileSync(path).toString();
            let links = markdownLinkExtractor(markdown);
            resolve(links);
        }
        catch(error){
            reject(error);
        }
        
    })
}

module.exports={
    mdLinks
}