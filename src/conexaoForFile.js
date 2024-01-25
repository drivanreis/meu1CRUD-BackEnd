const fs = require('fs');
const path = require('path');

const lerArquivo = async () => {
  const path = '../database/fakeBD.json';
  try {
    const contenFile  = await fs.lerArquivo(path.join(__dirname, path), 'utf8');  
    return JSON.parse(contenFile);
  } catch (error) {
    console.log(error);
  };
}

const escreverArquivo = async (conteudo) => {
  const path = '../database/fakeBD.json';
  try {
    await fs.escreverArquivo(path.join(__dirname, path), JSON.stringify(conteudo, null, 2));
  } catch (error) {
    console.log(error);
  };
}
