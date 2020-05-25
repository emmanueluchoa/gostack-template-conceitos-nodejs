const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  try {
    return response.status(200).json(repositories);
  } catch (error) {
    return response.status(400).json({ message: error });
  }
});

app.get(
  '/repositories/:id',
  validateRepositoryIdProvided,
  checkIfRepositoryExistsById,
  (request, response) => {
    try {
      return response.status(200).json(repositories[request.repositoryIndex]);
    } catch (error) {
      return response.status(400).json({ message: error });
    }
  }
);

app.post('/repositories', (request, response) => {
  try {
    let { title, url, techs } = request.body;

    if (!title) throw error('Title must be provided!');
    if (!url) throw error('Url repository must be provided!');
    if (!techs) throw error('Techs repository must be provided!');

    let repository = {
      id: uuid(),
      title,
      url,
      techs: techs.split(','),
      likes: 0,
    };

    repositories.push(repository);
    return response.status(200).json(repository);
  } catch (error) {
    return response.status(400).json({ message: error });
  }
});

app.put(
  '/repositories/:id',
  validateRepositoryIdProvided,
  checkIfRepositoryExistsById,
  (request, response) => {
    try {
      const { title, techs, url } = request.body;
      const repository = repositories[request.repositoryIndex];

      const repositoryUpdate = {
        id: repository.id,
        title: title ? title : repository.title,
        url: url ? url : repository.url,
        techs: techs ? techs.split(',') : repository.techs,
        likes: repository.likes,
      };

      repositories[request.repositoryIndex] = repositoryUpdate;

      return response.status(200).json(repositoryUpdate);
    } catch (error) {
      return response.status(400).json({ message: error });
    }
  }
);

app.delete(
  '/repositories/:id',
  validateRepositoryIdProvided,
  checkIfRepositoryExistsById,
  (request, response) => {
    try {
      repositories.splice(request.repositoryIndex, 1);

      return response.status(204).send();
    } catch (error) {
      return response.status(400).json({ message: error });
    }
  }
);

app.post(
  '/repositories/:id/like',
  validateRepositoryIdProvided,
  checkIfRepositoryExistsById,
  (request, response) => {
    try {
      repositories[request.repositoryIndex].likes = ++repositories[
        request.repositoryIndex
      ].likes;

      return response.status(200).json(repositories[request.repositoryIndex]);
    } catch (error) {
      return response.status(400).json({ message: error });
    }
  }
);

function validateRepositoryIdProvided(request, response, next) {
  try {
    const { id } = request.params;
    if (!id) throw error('Id repository must be provided!');

    next();
  } catch (error) {
    return response.status(400).json({ message: error });
  }
}

function checkIfRepositoryExistsById(request, response, next) {
  try {
    const { id } = request.params;

    let repositoryIndex = repositories.findIndex(
      (repository) => repository.id == id
    );

    if (-1 == repositoryIndex) throw 'Repository not found!';

    request.repositoryIndex = repositoryIndex;

    next();
  } catch (error) {
    return response.status(400).json({ message: error });
  }
}

module.exports = app;
