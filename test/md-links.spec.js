const mdLinks = require("../src/md-links");



describe('mdLinks', () => {

it('Debería retornar 8 links cuando lee el archivo prueba.md', async() => {    
  await expect(mdLinks.mdLinks('./prueba.md')).resolves.toEqual(
    [{href:'https://nodejs.org/en/', text:'Node.js', file:'./prueba.md' },
    {href: 'https://nodejs.org/docs/latest-v0.10.x/api/modules.html', text:'módulos (CommonJS)', file:'./prueba.md'},
    {href: 'https://nodejs.org/api/fs.html', text:'file system', file:'./prueba.md'},
    {href: 'https://nodejs.org/api/path.html', text:'path', file:'./prueba.md'},
    {href: 'https://nodejs.org/api/http.html#http_http_get_options_callback', text:'http.get', file:'./prueba.md'},
    {href: 'https://daringfireball.net/projects/markdown/syntax, CLI,', text:'markdown', file:'./prueba.md'},
    {href: 'https://docs.npmjs.com/misc/scripts', text:'npm-scripts', file:'./prueba.md'},
    {href: 'https://semver.org/', text:'semver', file:'./prueba.md'}]);
  });
  
  it('Debería retornar error ENOENT, si se ingresa un archivo que no existe (text-two.md)', async()  => {
    await expect(mdLinks.mdLinks('./text-two.md')).rejects.toEqual("ENOENT");
  });

  it('Debería retornar "Extensión no válida" para el archivo index.js', async()  => {
    await expect(mdLinks.mdLinks('./index.js')).rejects.toThrow("Extensión no válida");
  });
  
})