const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  try {
    return response.status(200).json(repositories);
  } catch (error) {
    return response.status(400).json({ message: error });
  }
});

app.post("/repositories", (request, response) => {
  try {
    let { title, url, techs } = request.body;

    if (!title) throw error("Title must be provided!");
    if (!url) throw error("Url repository must be provided!");
    if (!techs) throw error("Techs repository must be provided!");

    let repository = {
      id: ,
      title,
      url,
      techs,
      likes: 0
    };

    repositories.push(repository);
    return response.status(200).json(repositories);
  } catch (error) {
    return response.status(400).json({ message: error });
  }
});

app.put("/repositories/:id", (request, response) => {
  // TODO
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

module.exports = app;
