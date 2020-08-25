const express = require("express");
const cors = require("cors");

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

class Repo{
  constructor(title,url,techs){
    
    this.id = uuid();
    this.title = title;
    this.url = url;
    this.techs = techs;
    this.likes = 0;
  }

  update(body){
    const obj = body;
    if(obj?.title){
      this.title = body.title;
    }
    if(obj?.url){
      this.url = body.url;
    }
    if(obj?.techs){
      this.techs = body.techs;
    }
  }

  like(){
    this.likes++;
  }
}
const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepositorie = new Repo(title,url,techs);

  repositories.push(newRepositorie);

  return response.json(newRepositorie);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repoIndex = repositories.findIndex( repo => repo.id === id);

  if(repoIndex < 0){
    return response.status(400).json({ error : "repositorie not found"})
  }

  repositories[repoIndex].update(request.body);

  return response.json(repositories[repoIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex( repo => repo.id === id);
  if(repoIndex != -1){
    repositories.splice(repoIndex, 1);

    return response.status(204).send();
  }else{
    return response.status(400).send();
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex( repo => repo.id === id);

  if(repoIndex === -1){
    return response.status(400).json({ error : "repositorie not found"})
  }
  repositories[repoIndex].like();

  return response.json(repositories[repoIndex]);
});

module.exports = app;
