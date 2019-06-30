/*Uso de librerias de node.js*/
const fs = require('fs');
const nodepath = require('path');
const marked = require('marked');
const fetch = require('node-fetch');
const fileHound = require('filehound');


/*Función mdLinks conecta las funciones contruidas y establece la interacción entre index.js y md-links.js*/

const mdLinks = (path,options) => {
    if(options && options.validate){
        return new Promise((resolve,reject)=>{
            extractMdDirectory(path)
                .then((paths)=>{
                    Promise.all(paths.map((pathInDirectory)=>{                    
                        return extractLinksFile(pathInDirectory);                    
                    })).then((linksInDirectory)=>{
                        Promise.all(linksInDirectory.map((linkInDirectory)=>{                        
                            return validateLink(linkInDirectory);
                        })).then((validateLinks)=>{
                            resolve(validateLinks);
                        })
                    });                    
                    }).catch(()=>{
                        extractLinksFile(path)
                        .then((links)=>{
                            resolve(validateLink(links)); 
                })
            })
        })
    }
    else{
        return new Promise((resolve, reject)=>{
            try{
                extractMdDirectory(path)
                .then(res=>{
                    resolve(Promise.all(res.map(file=>{
                        return extractLinksFile(file); 
                    })))
                })
                .catch(()=>{                   
                    resolve(extractLinksFile(path));
                })
            }catch(err){
                reject(err);
            }           
        })
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
    return Promise.all(links.map(linkToValidate=>{
        return new Promise((resolve)=>{
            fetch(linkToValidate.href)
                .then(res=>{
                    linkToValidate.status = res.status;
                    linkToValidate.statusText = res.statusText;
                    resolve(linkToValidate);
                })
                .catch((err)=> {
                    linkToValidate.status=0;
                    linkToValidate.statusText=err.code;
                    resolve(linkToValidate);
                })                    
        });
    }))
}

/*Función statsLinks que realiza el calculo de estadística de un archivo
Para la opción stats se recibe como  parámetros  el arreglo de links, y la opción --validate
Se obtiene el href de los links del arreglo (parametro recibido)con  map(), y se guarda la información en el arreglo hrefArray
Se usa length para obtener links totales,  se guarda la formación en el objeto responseStats
Se usa metodo Set calcular los links unicos, que permite sacar los elementos sin repetirlos para guardarlos 
en el arreglo arraySet.
Se usa size(propiedad de Set) para calcular links unicos, y se guarda la información en el objeto responseStats
Se retorna el objeto responseStats
En el caso de ambas opciones --stats --validate
 Si se ingresa la opción --validate (los links rotos).
Se usa filter para los links que devuelvan un status igual a 0 o mayor e igual a 400.
Se retorna el objeto responseStats con linksTotal, linksUnique y linksBroken
*/

const statsLinks = (links, options)=>{
    let hrefLink = [];
    let responseStats = {};
    hrefLink = links.map(link=>{
        return link.href;
    });
    responseStats.linksTotal=hrefLink.length;
    let hrefSet= new Set(hrefLink);
    responseStats.linksUnique=hrefSet.size;
    if(options && options.validate){
        responseStats.linksBroken = links.filter(link=>{            
            return link.status===0 || link.status>=400;
        }).length;
        responseStatusCodesHTTP(responseStats, links);
        
    }
    return responseStats;
}



/*Función extractMdDirectory que permite obtener los archivos .md de un directorio*/

const extractMdDirectory=(path)=>{
    return fileHound.create()
    .paths(path)
    .ext('md')
    .find();
}

const responseStatusCodesHTTP =(responseStats, links) =>{
    responseStats.informationResponses = links.filter(link=>{
        return link.status>=100 && link.status<=199;
    }).length;
    responseStats.successfulResponses = links.filter(link=>{
        return link.status>=200 && link.status<=299;
    }).length;
    responseStats.redirectionMessages = links.filter(link=>{
        return link.status>=300 && link.status<=399;
    }).length;
    responseStats.clientErrorResponses = links.filter(link=>{
        return link.status>=400 && link.status<=499;
    }).length;
    responseStats.serverErrorResponses = links.filter(link=>{
        return link.status>=500 && link.status<=599;
    }).length;
    return responseStats;
}


module.exports={
    mdLinks,
    validateLink, 
    statsLinks,
    responseStatusCodesHTTP   
}