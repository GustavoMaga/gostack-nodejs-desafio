const express = require("express");
const cors = require("cors");
const {uuid, isUuid} = require('uuidv4')

const app = express();

function validateRepository(request, response, next){

  const {id} = request.params;

  if(!isUuid(id)){
      return response.status(400).json({error:'Repositório invalido.'});
  }

  return next();

}

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateRepository);

const repositories = [];

app.get("/repositories", (request, response) => {
  
  // TODO: GET /repositories: Rota que lista todos os repositórios;

  return (repositories.length < 1) ? 
    response.json({error:'Não contem nenhum repositorio registrado.'}) : response.json(repositories)
  
});

app.post("/repositories", (request, response) => {

  // TODO: POST /repositories: A rota deve receber title, url e techs dentro do corpo da requisição, sendo a URL o link para o github desse repositório. Ao cadastrar um novo projeto, ele deve ser armazenado dentro de um objeto no seguinte formato: { id: "uuid", title: 'Desafio Node.js', url: 'http://github.com/...', techs: ["Node.js", "..."], likes: 0 }; Certifique-se que o ID seja um UUID, e de sempre iniciar os likes como 0.
  
  const {title,url,techs} = request.body
  if(request.body != {}){
    const repository = {
      id: uuid(),
      title,
      url,
      techs,
      likes:0
    }
    repositories.push(repository)
    return response.json(repository)
  }else{
    return response.json({error:'Por favor preencha as informações de: titlo, url e techs.'})
  }

});

app.put("/repositories/:id", (request, response) => {
  // TODO: PUT /repositories/:id: A rota deve alterar apenas o title, a url e as techs do repositório que possua o id igual ao id presente nos parâmetros da rota;

  //get the repositories id
  const {id} = request.params;

  //find the index object
  const repositoriesIndex = repositories.findIndex(repositories => repositories.id == id);

  //case not has the repository
  if (repositoriesIndex==-1){
    return response.status(400).json({error:'Repositório não encontrado.'})
  }

  const {title,url,techs} = request.body

  const repository = {
    id,
    title,
    url,
    techs,
    likes:repositories[repositoriesIndex].likes
  }

  repositories[repositoriesIndex]=repository;

  return response.json(repository);
  
});

app.delete("/repositories/:id", (request, response) => {

  // TODO: DELETE /repositories/:id: A rota deve deletar o repositório com o id presente nos parâmetros da rota;

  const {id} = request.params;

  const repositoriesIndex = repositories.findIndex(repositories => repositories.id == id);

  if(repositories==-1)
    return response.status(400).json({error:'Repositório não existente.'});

  repositories.splice(repositoriesIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {

  // TODO: POST /repositories/:id/like: A rota deve aumentar o número de likes do repositório específico escolhido através do id presente nos parâmetros da rota, a cada chamada dessa rota, o número de likes deve ser aumentado em 1;

  const {id} = request.params

  const repositoriesIndex =  repositories.findIndex(repositories=>repositories.id == id);

  if(repositoriesIndex==-1)
    return response.status(400).json({error:'Repositório não existente.'});

  repositories[repositoriesIndex].likes++

  return response.json(repositories[repositoriesIndex])

});

module.exports = app;
