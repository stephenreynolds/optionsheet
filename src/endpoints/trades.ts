import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getRepository, Repository } from "typeorm";
import { Leg } from "../data/entities/leg";
import { Project } from "../data/entities/project";
import { Trade } from "../data/entities/trade";
import { User } from "../data/entities/user";
import { logError, sendError } from "../errorResponse";

const onProjectUpdated = async (project: Project, projectRepository: Repository<Project>) => {
  await projectRepository.update({ id: project.id }, { lastEdited: new Date() });
};

export const getTrades = async (request: Request, response: Response) => {
  try {
    const userRepository = getRepository(User);
    const username = request.params.username;
    const user = await userRepository.findOne({ username });

    if (!user) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "User does not exist.");
      return;
    }

    const projectRepository = getRepository(Project);
    const projectName = request.params.project;
    const project = await projectRepository.findOne({ name: projectName });

    if (!project) {
      sendError(request, response, StatusCodes.BAD_REQUEST, "Project does not exist");
      return;
    }

    const tradeRepository = getRepository(Trade);
    const trades = await tradeRepository.find({ project });

    response.send(trades.map((trade) => {
      return {
        ...trade,
        legs: trade.legs.map((leg) => {
          return {
            ...leg,
            quantity: Number(leg.quantity),
            strike: Number(leg.strike),
            openPrice: Number(leg.openPrice),
            closePrice: leg.closePrice ? Number(leg.closePrice) : null
          };
        })
      };
    }));
  }
  catch (error) {
    const message = "Failed to get trades";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};

export const getTradeById = async (request: Request, response: Response) => {
  try {
    const tradeRepository = getRepository(Trade);
    const id = Number(request.params.id);
    const trade = await tradeRepository.findOne(id);

    if (!trade) {
      sendError(request, response, StatusCodes.NOT_FOUND, "That trade does not exist.");
      return;
    }

    response.send({
      ...trade,
      legs: trade.legs.map((leg) => {
        return {
          ...leg,
          quantity: Number(leg.quantity),
          strike: Number(leg.strike),
          openPrice: Number(leg.openPrice),
          closePrice: leg.closePrice ? Number(leg.closePrice) : null
        };
      })
    });
  }
  catch (error) {
    const message = "Failed to get trade by id";
    logError(error, message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};

export const addTrade = async (request: Request, response: Response) => {
  const userRepository = getRepository(User);
  const username = request.params.username;
  const projectName = request.params.project;

  const user = await userRepository.findOne({ username });
  if (!user) {
    sendError(request, response, StatusCodes.BAD_REQUEST, "User does not exist.");
    return;
  }

  const projectRepository = getRepository(Project);
  const project = await projectRepository.findOne({
    user: user.id,
    name: projectName
  });
  if (!project) {
    sendError(request, response, StatusCodes.BAD_REQUEST, "User does not have a project with that name.");
    return;
  }

  try {
    const tradeRepository = getRepository(Trade);
    const legs: Leg[] = request.body.legs;

    const trade: Trade = {
      ...request.body,
      legs,
      project
    };
    await tradeRepository.save(trade);

    await onProjectUpdated(project, projectRepository);

    response.sendStatus(StatusCodes.CREATED);
  }
  catch (error) {
    console.log(error.message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to add trade.");
  }
};

export const updateTradeById = async (request: Request, response: Response) => {
  const tradeRepository = getRepository(Trade);
  const id = Number(request.params.id);
  let trade = await tradeRepository.findOne(id, { relations: ["project"] });

  if (!trade) {
    sendError(request, response, StatusCodes.NOT_FOUND, "That trade does not exist.");
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...updatedTrade } = request.body;

    trade = {
      ...trade,
      ...updatedTrade
    };

    await tradeRepository.save(trade);

    const projectRepository = getRepository(Project);
    await onProjectUpdated(trade.project, projectRepository);

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    console.log(error.message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update trade.");
  }
};

export const deleteTradeById = async (request: Request, response: Response) => {
  const tradeRepository = getRepository(Trade);
  const id = Number(request.params.id);
  const trade = await tradeRepository.findOne(id, { relations: ["project"] });

  try {
    await tradeRepository.delete(id);

    const projectRepository = getRepository(Project);
    await onProjectUpdated(trade.project, projectRepository);

    response.sendStatus(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    console.log(error.message);
    sendError(request, response, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete trade.");
  }
};