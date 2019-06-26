/*Uso de librerias de node.js*/
const fs = require('fs');
const nodepath = require('path');
const marked = require('marked');
const fetch = require('node-fetch');



/*Función mdLinks para conectar las funciones contruidas y permitir la interacción entre index.js y md-links.js*/

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
   Se guarda el contenido del archivo path como  string en la variable marked
   Se crea un renderer que en caso de la ejecución exitosa de la promesa, sustituirá el renderer por el creado que
   en vez de convertir los links a html resolvera el arreglo de links.*/

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


/* Función validateLink para agregar el status a los links encontrados en un archivo.
 Se crea una nueva promesa con  fetch para ir agregando a cada link su status y textStatus, 
 la promesa se resuelve (resolve) o generar un error (reject).
 Se retorna una Promise.all() que devuelve el arreglo de links al cual se aplica un map , para agregar a cada link
 el status y textstatus.*/

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


/*Función statsLinks que realiza el calculo de estadística de un archivo
Para la opción --stats se recibe como  parámetros  el arreglo de links, y la opción --validate
Se obtiene el href de los links del arreglo (parametro recibido)con  map(), y se guarda la información en el arreglo hrefArray
Se usa length para obtener links totales,  se guarda la formación en el objeto responseStats
Se usa metodo Set calcular los links unicos, que permite sacar los elementos sin repetirlos para guardarlos 
en el arreglo arraySet.
Se usa size(propiedad de Set) para calcular links unicos, y se guarda la información en el objeto responseStats
Se retorna el objeto responseStats
En el caso de ambas opciones --stats --validate
 Si se ingresa la opción --validate (los links rotos).
Se usa filter para los links que devuelvan un status igual a 0 o mayor e igual a 400.
Se retorna el objeto responseStats con linksTotal, linksUnique y linksBroken*/

const statsLinks = (links, options)=>{
    let hrefArray = [];
    let responseStats = {};
    hrefArray = links.map(link=>{
        return link.href;
    });
    responseStats.linksTotal=hrefArray.length;
    let arraySet= new Set(hrefArray);
    responseStats.linksUnique=arraySet.size;
    if(options && options.validate){
        responseStats.linksBroken = links.filter(link=>{
            return link.status===0 || link.status>=400;
        }).length;
    }
    return responseStats;
}

module.exports={
    mdLinks,
    validateLink, 
    statsLinks
}
