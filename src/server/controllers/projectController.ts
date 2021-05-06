import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Project } from "../data/entity/project";
import HttpStatus from "http-status-codes";

export const createProject = async (request: Request, response: Response) => {
  const projectRepository = getRepository(Project);
  const name = request.body.name;
  const description = request.body.description;
  const tags = request.body.tags;
  const userId = request.body.userId;

  // Check that the user does not already have a project with this name.
  const projectExists = await projectRepository.findOne({ name, user: userId });
  if (projectExists) {
    response
      .status(HttpStatus.BAD_REQUEST)
      .send(`User already has a project named ${name}`);
    return;
  }

  const project: Project = {
    name,
    description,
    tags: tags ? tags : [],
    user: userId
  };

  console.log(project);

  projectRepository
    .save(project)
    .then(() => {
      response.sendStatus(HttpStatus.CREATED);
    })
    .catch((err) => {
      response
        .sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(`Failed to create project: ${err.message}`);
    });
};

export const getProjects = async (request: Request, response: Response) => {
  const projectRepository = getRepository(Project);
  const userId = parseInt(request.header("userId"));

  if (isNaN(userId)) {
    response.status(HttpStatus.BAD_REQUEST).send("Invalid user id");
  }

  const projects = await projectRepository.find({ user: userId });

  const res = projects.map(project => {
    return {
      name: project.name,
      description: project.description
    }
  });

  response.send(res);
};
