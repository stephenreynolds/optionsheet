import { getRepository } from "typeorm";
import { User } from "../data/entity/user";
import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status-codes";

export const getAllUsers = async (request: Request, response: Response) => {
  const userRepository = getRepository(User);
  return userRepository.find();
};

export const getUser = async (request: Request, response: Response) => {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne(request.params.id);

  if (!user) {
    response.status(HttpStatus.NOT_FOUND);
    return;
  }

  return user;
};

export const saveUser = async (request: Request, response: Response) => {
  const userRepository = getRepository(User);
  return userRepository.save(request.body);
};

export const removeUser = async (request: Request, response: Response) => {
  const userRepository = getRepository(User);
  const userToRemove = await userRepository.findOne(request.params.id);

  if (userToRemove) {
    await userRepository.remove(userToRemove);
  }

  response.sendStatus(HttpStatus.NO_CONTENT);
};
