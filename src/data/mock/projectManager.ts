import { IProjectManager } from "../interfaces";
import { ProjectCreateModel, ProjectUpdateModel } from "../models/project";

export class MockProjectManager implements IProjectManager {
  addProject(userUUID: string, model: ProjectCreateModel): Promise<any> {
    return Promise.resolve(undefined);
  }

  addProjectTags(id: number, tags: string[]): Promise<void> {
    return Promise.resolve(undefined);
  }

  deleteProject(id: number): Promise<void> {
    return Promise.resolve(undefined);
  }

  getProjectById(id: number): Promise<any> {
    return Promise.resolve(undefined);
  }

  getProjectByName(userUUID: string, name: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  getProjectMatches(term: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  getProjectTags(id: number): Promise<any> {
    return Promise.resolve(undefined);
  }

  getProjectsByName(name: string, offset: number, limit?: number): Promise<any> {
    return Promise.resolve(undefined);
  }

  getUserProjects(userUUID: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  updateProject(id: number, model: ProjectUpdateModel): Promise<any> {
    return Promise.resolve(undefined);
  }
}