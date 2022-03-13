import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../data/entities/user";
import { StatusCodes } from "http-status-codes";

interface UserDetails {
  username: string;
  url: string;
  html_url: string;
  projects_url: string;
  email: string;
  avatar_url: string;
  bio: string;
  created_on: Date;
  updated_on: Date;
  is_admin: boolean;
}

export const getAuthenticatedUser = async (request: Request, response: Response) => {
  const id = request.body.userId;
  const userRepository = getRepository(User);
  const user = await userRepository.findOne(id);

  const isAdmin = !!user.roles.find(role => role.name === "admin");

  const userDetails: UserDetails = {
    username: user.username,
    url: `https://api.optionsheet.net/users/${user.username}`,
    html_url: `https://optionsheet.net/${user.username}`,
    projects_url: `https://optionsheet.net/${user.username}/projects`,
    email: user.email,
    avatar_url: user.avatarUrl,
    bio: user.bio,
    created_on: new Date(user.createdOn),
    updated_on: new Date(user.updatedOn),
    is_admin: isAdmin
  };

  response.status(StatusCodes.OK).send(userDetails);
};