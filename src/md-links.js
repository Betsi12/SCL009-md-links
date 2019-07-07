/*Librerias de node.js utilizadas*/
const fs = require('fs');
const routepath = require('path');
const marked = require('marked');
const fetch = require('node-fetch');
const fileHound = require('filehound');


/*Función mdLinks conecta las funciones contruidas y establece la interacción entre index.js y md-links.js*/

const mdLinks = (path,options) => {
    if(options && options.validate){
        return new Promise((resolve,reject)=>{
            readLinksFolder(path)
                .then((paths)=>{
                    Promise.all(paths.map((pathInDirectory)=>{                    
                        return readLinksFile(pathInDirectory);                    
                    })).then((linksInDirectory)=>{
                        Promise.all(linksInDirectory.map((linkInDirectory)=>{                        
                            return validateLink(linkInDirectory);
                        })).then((validateLinks)=>{
                            resolve(validateLinks);
                        })
                    });                    
                    }).catch(()=>{
                        readLinksFile(path) // razón de rechazo seria si el path es un archivo.
                        .then((links)=>{
                            resolve(validateLink(links)); 
                })
            })
        })
    }
    else{
        return new Promise((resolve, reject)=>{
            try{
                readLinksFolder(path)
                .then(res=>{
                    resolve(Promise.all(res.map(file=>{
                        return readLinksFile(file); 
                    })))
                })
                .catch(()=>{                   
                    resolve(readLinksFile(path));
                })
            }catch(err){
                reject(err);
            }           
        })
    }
}
            
    
   /*Función readLinksFile  extrae los links de un archivo .md
   Se crea una promesa con parametro resolve y reject para leer los archivos y entregar array de links
   Se crea un array para guardar los links
   Se guarda el contenido del archivo path como  string en la variable marked
   Se crea un renderer que en caso de la ejecución exitosa de la promesa, sustituirá el renderer por el creado que
   en vez de convertir los links a html resolvera el arreglo de links.*/

   const readLinksFile = (path)=>{
    return new Promise((resolve,reject)=>{
        try{
            if(routepath.extname(path)!=".md"){
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

/*Función statsLinks que realiza el calculo estadistico de los links de un archivo .md
Se obtiene el href de los links del arreglo de links recibido como parametro con  map(),se guarda la información en el arreglo hrefLinks
length para obtener links totales,  se guarda la formación en el objeto responseStats
Set para sacar los links unicos y se guardan en el arreglo arraySet.
size(propiedad de Set) para calcular links unicos, y se guarda la información en el objeto responseStats
En el caso de ambas opciones --stats --validate
filter para los links que devuelvan un status = a 0 Ó >= a 400.
Se retorna el objeto responseStats con linksTotal, linksUnique y linksBroken 
más el listado de codigos de respuesta HTTP corresondiente a esos links*/

const statsLinks = (links, options)=>{
    let hrefLinks = [];
    let responseStats = {};
    hrefLinks = links.map(link=>{
        return link.href;
    });
    responseStats.linksTotal=hrefLinks.length;
    let arraySet= new Set(hrefLinks);
    responseStats.linksUnique=arraySet.size;
    if(options && options.validate){
        responseStats.linksBroken = links.filter(link=>{            
            return link.status===0 || link.status>=400;
        }).length;
        responseStatusHTTP(responseStats, links);
        
    }
    return responseStats;
}



/*Función readLinksFolder imprime todos los archivos .md de un directorio*/

const readLinksFolder=(path)=>{
    return fileHound.create()
    .paths(path)
    .ext('md')
    .find(); 
}

const responseStatusHTTP =(responseStats, links) =>{
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
    responseStatusHTTP   
}