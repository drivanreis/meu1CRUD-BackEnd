const express = require('express');
const fs = require('fs');
const path = require('path');
const usuariosFile = require('../database/fakeBD.json');
const app = express();
const port = 3501
const URL = "http://localhost"

// Função especial do express para ler o corpo da requisição.
// MUITO INPORTANTE: Sempre que for usar o express.json() ele deve vir antes das rotas.
app.use(express.json());

// Nossa missão é criar o primeiro CRUD.
// CRUD é a sigla para Create, Read, Update e Delete.
// Mas vamos fazer em outra ordem, para ficar mas claro e didatico.
// Vamos fazer a ordem: Read(1.0; 1.1; 1.2), Delete(2.0), Create(3.0) e Update(4.0).

// Função para escrever as alterações de volta no arquivo
// function atualizarArquivo() {
//  fs.writeFileSync('../database/fakeBD.json', JSON.stringify(usuariosFile, null, 2));
// }
function atualizarArquivo() {
  const caminhoArquivo = path.join(__dirname, '../database/fakeBD.json');
  fs.writeFileSync(caminhoArquivo, JSON.stringify(usuariosFile, null, 2));
}

// Criei a constante usuariosFile para ser usada provisoriamente// Criei a constante usuariosFile para ser usada provisoriamente
/* const usuariosFile = {
  usuarios: [
    {
        id: 1,
        nome: "Juan",
        active: false,
    },
    {
      id: 2,
      nome: "Tuan",
      active: false,
    },
    {
    id: 1,
    nome: "Fuan",
    active: false,
    },
  ],
  nextID: 4
}
*/

// 1.0 - Read Origem
app.get('/', (req, res) => {
  return res.status(200)
    .send(
      `<h1> Ola, Mundo! - Servidor rodando na porta ${port}</h1>
       <h2>Digite no fim da URL "/usuarios"  </h2>
       <h3>Ou clique no link <a href="${URL}:${port}/usuarios">${URL}:${port}/usuarios</a></h3>`
    );
});


// 1.1 - Read /Usuarios
app.get('/usuarios', (req, res) => {
  const usuarios = usuariosFile.usuarios;

  const listaHtmlUsuarios = usuarios.map(usuario => 
    `<li>
      ID: ${usuario.id},
      <a href="${URL}:${port}/usuarios/${usuario.id}">Nome: ${usuario.nome}</a>,
      Ativo: ${usuario.ativo ? 'Sim' : 'Não'}
    </li>`
  ).join('<br>');

  const htmlCompleto = `<ul>${listaHtmlUsuarios}</ul><br>
    <h2>Digite no fim da URL um Id de usuário, ou Clique nos links acima</h2>
    <h3>Exemplo: ${URL}:${port}/usuarios/1</h3>`;

  return res.status(200).send(htmlCompleto);
});



// 1.2 - Read /Usuarios/id
app.get('/usuarios/:id', (req, res) => {
  const id = req.params.id;
  const usuario = usuariosFile.usuarios.find(usuarioAtual => usuarioAtual.id === +id);

  if (!usuario) {
    return res.status(404).send(`Usuario com ID ${id}, não encontrado`);
  }

  return res.status(200).json({
    id: usuario.id,
    nome: usuario.nome,
    ativo: usuario.ativo,
  });
});


// 2.0 Deletar
app.delete('/usuarios/:id', (req, res) => {
  const id = req.params.id;
  const idExcluir = usuariosFile.usuarios.findIndex(usuarioAtual => usuarioAtual.id === +id);

  if (idExcluir === -1) {
    return res.status(404).send(`Usuario com ID ${id}, não encontrado `);
  }
   
  usuariosFile.usuarios.splice(idExcluir, 1);
  
  // Escreve as alterações de volta no arquivo
  atualizarArquivo();

  return res.status(204).end(`Usuario com ID ${id}, deletado com sucesso!`);

})


// 3.0 - Create
app.post('/usuarios', (req, res) => {
  const nome = req.body.nome;
  const id = usuariosFile.nextID++;
  const ativo = true

  const novoUsuario = {
    id,
    nome,
    ativo,
  }

  usuariosFile.usuarios.push(novoUsuario);

  // Escreve as alterações de volta no arquivo
  atualizarArquivo();


  return res.status(201).json(`Usuario ${ novoUsuario.nome } , Criado com sucesso!`);

})

// 4.0 - Update
app.put('/usuarios/:id', (req, res) => {
  const id = req.params.id;
  const nome = req.body.nome;
  const ativo = req.body.ativo;

  const usuario = usuariosFile.usuarios.find(usuarioAtual => usuarioAtual.id === +id);

  if (!usuario) {
    return res.status(404).send(`Usuario com ID ${id}, não encontrado `);
  }

  usuario.nome = nome;
  usuario.ativo = ativo;


  // Escreve as alterações de volta no arquivo
  atualizarArquivo();


  return res.status(200).json(`Usuario com ID ${id}, atualizado com sucesso!`);

})




app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
})