import { getRepository } from "typeorm";
import { User } from "../data/entity/user";
import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status-codes";

export class UserController {
  private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const user = await this.userRepository.findOne(request.params.id);

    if (!user) {
      response.status(HttpStatus.NOT_FOUND);
      return;
    }

    return user;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.save(request.body);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const userToRemove = await this.userRepository.findOne(request.params.id);

    if (userToRemove) {
      await this.userRepository.remove(userToRemove);
    }

    response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
