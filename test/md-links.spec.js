const fs = require('fs')

const markdownLinkExtractor = require('markdown-link-extractor');

let markdown = fs.readFileSync(process.argv[2]).toString();

let links = markdownLinkExtractor(markdown);

links.forEach(function (link) {
    console.log(link);
});