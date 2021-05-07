import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Project } from "../data/entity/project";
import HttpStatus from "http-status-codes";
import { User } from "../data/entity/user";
import { Leg, Trade } from "../data/entity/trade";

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
  const userRepository = getRepository(User);
  const username = request.params.username;

  const user = await userRepository.findOne({ username });

  if (!user) {
    response.status(HttpStatus.BAD_REQUEST).send("User does not exist");
    return;
  }

  const projects = await projectRepository.find({ user: user.id });

  const res = projects.map((project) => {
    return {
      name: project.name,
      description: project.description
    };
  });

  response.send(res);
};

export const getProjectByName = async (
  request: Request,
  response: Response
) => {
  const userRepository = getRepository(User);
  const username = request.params.username;
  const projectName = request.params.project;

  const user = await userRepository.findOne({ username });
  if (!user) {
    response.status(HttpStatus.BAD_REQUEST).send("User does not exist");
    return;
  }

  const projectRepository = getRepository(Project);
  const project = await projectRepository.findOne(
    {
      user: user.id,
      name: projectName
    },
    {
      relations: ["trades"]
    }
  );
  if (!project) {
    response
      .status(HttpStatus.BAD_REQUEST)
      .send("User does not have a project with that name");
    return;
  }

  const res = {
    name: project.name,
    userId: project.user,
    description: project.description,
    tags: project.tags,
    trades: project.trades
  };

  response.send(res);
};

export const addTrade = async (request: Request, response: Response) => {
  const userRepository = getRepository(User);
  const username = request.params.username;
  const projectName = request.params.project;

  const user = await userRepository.findOne({ username });
  if (!user) {
    response.status(HttpStatus.BAD_REQUEST).send("User does not exist");
    return;
  }

  const projectRepository = getRepository(Project);
  const project = await projectRepository.findOne({
    user: user.id,
    name: projectName
  });
  if (!project) {
    response
      .status(HttpStatus.BAD_REQUEST)
      .send("User does not have a project with that name");
    return;
  }

  try {
    const tradeRepository = getRepository(Trade);
    const legRepository = getRepository(Leg);
    const legs: Leg[] = request.body.legs;
    await legRepository.save(legs);

    const trade: Trade = { ...request.body, legs, project };
    await tradeRepository.save(trade);

    response.sendStatus(HttpStatus.CREATED);
  } catch (error) {
    console.log(error.message);
    response.status(HttpStatus.BAD_REQUEST).send("Failed to add trade.");
  }
};
