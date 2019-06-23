const mdLinks = require('../md-links');

describe('mdLinks', () => {

  it('Debería retornar 2 links para el archivo prueba.md', () => {    
    expect(mdLinks.mdLinks('./prueba.md')).resolves.toEqual(['https://es.wikipedia.org/wiki/Markdown',
    'https://nodejs.org/']);
  });

  });