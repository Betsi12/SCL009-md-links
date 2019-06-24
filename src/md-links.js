/*Uso de librerias de node.js*/
const fs = require('fs');
const nodepath = require('path');
const marked = require('marked');
const fetch = require('node-fetch');


/*Función mdLinks 
- Permite la conexión entre las funciones contruidas
- Permite la interacción entre index.js y md-links.js*/

const mdLinks = (path,option) => {
    if(option && option.validate){
        return new Promise((resolve,reject)=>{
            extractLinksFile(path).then((links)=>{
                resolve(validateLink(links));
            });
        })
    }
    else{
        return extractLinksFile(path);
    }
}


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
            fs.readFile(path,'utf-8',(err, content)=>{
                if(err){
                    reject(err.code);
                }
                else{
                    let links=[];
                    const renderer = new marked.Renderer();
                    renderer.link = function(href, title, text){
                        links.push({
                            href:href,
                            text: text,
                            file: path
                        })
                    }
                    marked(content,{renderer:renderer});
                    resolve(links);
                }
            })  
        }
        catch(error){
            reject(error);
        }
        
    })
}

/* Función validateLink que permite agregar el status a los links encontrados en un archivo
 Se retorna una Promise.all() donde al arreglo de links se le aplica un map, para que posteriormente
a cada elemento encontrado se le agregue el status y textstatus. Se crea una nueva promesa, que al usar fetch puedo ir agregando a cada link su status y textStatus
Con esto, puedo resolver la promesa (resolve) o generar un error (reject)
*/

const validateLink = (links)=>{
    return Promise.all(links.map(link=>{
        return new Promise((resolve,reject)=>{
            fetch(link.href)
                .then(res=>{
                    link.status = res.status;
                    link.statusText = res.statusText;
                    resolve(link);
                })
                .catch((err)=> {
                    link.status=0;
                    link.statusText=err.code;
                    resolve(link);
                })                    
        });
    }))
}

/*Función statsLinks que permite realizar el calculo de estadística de un archivo*/

const statsLinks = (links)=>{
    let hrefLink = [];
    let responseStats = {};
    hrefLink = links.map(link=>{
        return link.href;
    });
    responseStats.linksTotal=hrefLink.length;

    let hrefSet= new Set(hrefLink);
    responseStats.linksUnique=hrefSet.size;
    return responseStats;
}

module.exports={
    mdLinks,
    validateLink, 
    statsLinks
}