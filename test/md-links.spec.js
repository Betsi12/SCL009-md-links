const mdLinks = require("../src/md-links");

describe('mdLinks', () => {

  it('Debería retornar 3 links para el archivo prueba.md', async() => {    
    await expect(mdLinks.mdLinks('./prueba.md')).resolves.toEqual(
      [{href:'https://es.wikipedia.org/wiki/Markdown', text:'Markdown', file:'./prueba.md' },
      {href: 'https://nodejs.org/', text:'md-links', file:'./prueba.md'},
      {href: 'https://user-images.githubusercontent.com',text:'Node.js', file:'./prueba.md'}]);
  });
  
  it('Debería retornar error para el archivo prueba2.md', async()  => {
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
  
  it('Debería retornar la estadística linksTotal:3, linksUnique:3 y linksBroken:0 para el archivo prueba.md',()=>{
    expect(mdLinks.statsLinks(
    [{href:'https://es.wikipedia.org/wiki/Markdown',status:200 },{href: 'https://nodejs.org/', status:200},{href:'https://user-images.githubusercontent.com', status:200}],{validate:true}))
    .toEqual({linksTotal: 3, linksUnique: 3, linksBroken:0 });
  });
  
});

