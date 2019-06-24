const mdLinks = require('../md-links');

describe('mdLinks', () => {

  it('Debería retornar 2 links para el archivo prueba.md', async() => {    
    await expect(mdLinks.mdLinks('./prueba.md')).resolves.toEqual(
      [{href:'https://es.wikipedia.org/wiki/Markdown', text:'Markdown', file:'./prueba.md' },
      {href: 'https://nodejs.org/', text:'Node.js', file:'./prueba.md'}]);
  });
  /*
  it('Debería retornar error para el archivo prueba2.md', async()  => {
    await expect(mdLinks.mdLinks('./prueba2.md')).rejects.toThrow("ENOENT: no such file or directory, open './prueba2.md'");
  });
 */
  it('Debería retornar "Extension no válida" para el archivo text.txt', async()  => {
    await expect(mdLinks.mdLinks('./text.txt')).rejects.toThrow("Extensión no válida");
  });

});