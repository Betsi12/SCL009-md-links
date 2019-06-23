const mdLinks = require('../md-links');

describe('mdLinks', () => {

  it('Debería retornar 2 links para el archivo prueba.md', () => {    
    expect(mdLinks.mdLinks('./prueba.md')).resolves.toEqual(['https://es.wikipedia.org/wiki/Markdown',
    'https://nodejs.org/']);
  });

  it('Debería retornar error ENOENT, si se intenta leer un archivo que no existe (test2.md)', async()  => {
    await expect(mdLinks.mdLinks('./test2.md')).rejects.toEqual("ENOENT");
  });

});