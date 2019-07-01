const mdLinks = require("../src/md-links");

describe('mdLinks', () => {

  it('Debería retornar 2 links para el archivo prueba.md', async() => {    
    await expect(mdLinks.mdLinks('./prueba.md')).resolves.toEqual(
      [{href:'https://es.wikipedia.org/wiki/Markdown', text:'Markdown', file:'./prueba.md' },
      {href: 'https://nodejs.org/', text:'Node.js', file:'./prueba.md'}]);
  });
  
  it('Debería retornar error para el archivo miprueba.md', async()  => {
    await expect(mdLinks.mdLinks('./miprueba.md')).rejects.toEqual("ENOENT");
  });

  it('Debería retornar "Extension no válida" para el archivo text.txt', async()  => {
    await expect(mdLinks.mdLinks('./text.txt')).rejects.toThrow("Extensión no válida");
  });

  it('Debería retornar 2 links para el archivo prueba.md validando su status y statusText', async () => {
    await expect(mdLinks.mdLinks('./prueba.md',{validate:true})).resolves.toEqual(
    [{href:'https://es.wikipedia.org/wiki/Markdown', text:'Markdown', file:'./prueba.md',status:200,statusText:'OK' },
    {href: 'https://nodejs.org/', text:'Node.js', file:'./prueba.md', status:200, statusText:'OK'}]);
  });

  it('Debería retornar un error al chequear un link no válido', async()=>{
    await expect(mdLinks.validateLink([{href:'https://holi.wikipedia.org/wiki/Markdown', 
    text:'Markdown', file:'./prueba.md'}])).resolves.toEqual([{href:'https://holi.wikipedia.org/wiki/Markdown', 
    text:'Markdown', file:'./prueba.md', status:0, statusText:"ENOTFOUND" }]);
  });

  it('Debería retornar la estadística linksTotal:3 y linksUnique:3 para el archivo prueba.md',()=>{
    expect(mdLinks.statsLinks(
    [{href:'https://es.wikipedia.org/wiki/Markdown'},{href: 'https://nodejs.org/'},
    {href: 'https://user-images.githubusercontent.com'}])).toEqual({"linksTotal": 3, "linksUnique": 3});
  });
  
  it('Debería retornar la estadística linksTotal:2, linksUnique:2, linksBroken:0 y códigos de estado para el archivo prueba.md ',()=>{
    expect(mdLinks.statsLinks(
    [{href:'https://es.wikipedia.org/wiki/Markdown',status:200 },{href: 'https://nodejs.org/', status:200}],{validate:true}))
    .toEqual({linksTotal: 2, linksUnique: 2, linksBroken:0, informationResponses:0, successfulResponses:2, 
      redirectionMessages:0, clientErrorResponses:0,  serverErrorResponses:0});
  });

  it('Deberia retornar 2 links para los archivos  en el directorio .\\PruebasMd', async()=>{
    await expect(mdLinks.mdLinks('.\\PruebasMd')).resolves.toEqual([
      [{href:'https://es.wikipedia.org/wiki/Markdown', text:'Markdown', file:'PruebasMd\\test1.md'}],
      [{href:'https://nodejs.org/', text:'Node.js', file:'PruebasMd\\test2.md'}]]
     );
  });

  it('Debería retornar 2 links para los archivos del directorio .\\PruebasMd, validando su status y statusText', async () => {
    await expect(mdLinks.mdLinks('.\\PruebasMd',{validate:true})).resolves.toEqual([
      [{href:'https://es.wikipedia.org/wiki/Markdown', text:'Markdown', file:'PruebasMd\\test1.md', status:200, statusText:'OK'}],
      [{href:'https://nodejs.org/', text:'Node.js', file:'PruebasMd\\test2.md', status:200, statusText:'OK' }]      
    ]);
  })

});

