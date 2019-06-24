/*Librerias de node.js usadas */
const nodepath = require('path');
const fs = require('fs')
const marked = require('marked');

/*Función extractLinksFile  extrae los links de un archivo .md
   Se crea una promesa con parametro resolve y reject para leer los archivos y entregar array de links
   Se crea un array para guardar los links
   Se guarda el contenido del archivo path como  string en la variable mardown
   Se crea un renderer que en caso de la ejecución exitosa de la promesa, sustituirá el renderer por defecto, en vez de convertir
   los links a html resolvera el arreglo de links.
   Se guardan los links en el array */

const extractLinksFile = (path)=>{
    return new Promise((resolve,reject)=>{
        try{
            if(nodepath.extname(path)!=".md"){ 
                throw(new Error("Extensión no válida"));
            }
            let links=[]; 
            let markdown = fs.readFileSync(path).toString();  
            const renderer = new marked.Renderer(); 
            renderer.link = function(href, title, text) { 
                links.push({
                    href: href,
                    text: text,                  
                    file:path
                });
            };
            /*Se usa el renderer creado anteriormente*/
            marked(markdown,{renderer:renderer});
            /*Si la promesa se resuelve con exito el valor  de resolve es enviado a  mdLinks (.then)*/ 
            resolve(links);
        }
        catch(error){
            /*Si la promesa falla, el valor reject se envia a  mdLinks (.catch)*/
            reject(error);
        }
        
    })
}

module.exports={
    extractLinksFile
}
