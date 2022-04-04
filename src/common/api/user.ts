import api, { baseURL } from "./api";
import { DefaultProjectSettingsModel, User, UserUpdateModel } from "../models/user";
import { Project } from "../models/project";

export const getAuthenticatedUser = () => {
  return api.get(`/user`)
    .then(({ data }) => {
      return {
        username: data.username,
        url: data.url,
        htmlUrl: data.html_url,
        projectsUrl: data.projects_url,
        email: data.email,
        avatarUrl: data.avatar_url,
        bio: data.bio,
        createdOn: new Date(data.created_on),
        updatedOn: new Date(data.updated_on),
        isAdmin: data.isAdmin
      } as User;
    });
};

export const getUser = (username: string): Promise<User> => {
  return api.get(`/users/${username}`)
    .then(({ data }) => {
      return {
        username: data.username,
        url: data.url,
        htmlUrl: data.html_url,
        projectsUrl: data.projects_url,
        email: data.email,
        avatarUrl: data.avatar_url,
        bio: data.bio,
        createdOn: new Date(data.created_on),
        updatedOn: new Date(data.updated_on),
        isAdmin: data.isAdmin
      } as User;
    });
};

export const updateUser = async (data: UserUpdateModel): Promise<User> => {
  return api.patch(`/user`, data)
    .then(({ data }) => {
      return {
        username: data.username,
        url: data.url,
        htmlUrl: data.html_url,
        projectsUrl: data.projects_url,
        email: data.email,
        avatarUrl: data.avatar_url,
        bio: data.bio,
        createdOn: new Date(data.created_on),
        updatedOn: new Date(data.updated_on),
        isAdmin: data.isAdmin
      } as User;
    });
};

export const deleteUser = async (): Promise<void> => {
  return api.delete(`/user`);
};

export const setAvatar = async (file): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/user/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }).then(({ data }) => {
    return data.avatar_url;
  });
};

export const getAvatarUrl = (avatarUrl): string => {
  if (!avatarUrl) {
    return "/img/profile.png";
  }

  return `${baseURL}/${avatarUrl}`;
};

export const getDefaultProjectSettings = async (): Promise<DefaultProjectSettingsModel> => {
  return api.get(`/user/settings`)
    .then(({ data }) => {
      return {
        defaultStartingBalance: parseFloat(data.default_starting_balance),
        defaultRisk: parseFloat(data.default_risk)
      } as DefaultProjectSettingsModel;
    });
};

export const updateDefaultProjectSettings = async (model: DefaultProjectSettingsModel): Promise<DefaultProjectSettingsModel> => {
  return api.patch(`/user/settings`, model)
    .then(({ data }) => {
      return {
        defaultStartingBalance: parseFloat(data.default_starting_balance),
        defaultRisk: parseFloat(data.default_risk)
      } as DefaultProjectSettingsModel;
    });
};

export const starProject = async (ownerUsername: string, projectName: string): Promise<void> => {
  return api.put(`/user/starred/${ownerUsername}/${projectName}`);
};

export const unStarProject = async (ownerUsername: string, projectName: string): Promise<void> => {
  return api.delete(`/user/starred/${ownerUsername}/${projectName}`);
};

export const setPinnedProjects = async (projectIds: number[]): Promise<number[]> => {
  return api.put(`/user/pinned`, { projectIds });
};

export const checkProjectStarred = async (ownerUsername: string, projectName: string): Promise<void> => {
  return api.get(`/user/starred/${ownerUsername}/${projectName}`);
};

export const getStarredProjects = async (username: string): Promise<Project[]> => {
  return api.get(`/users/${username}/starred`)
    .then(({ data }) => {
      return data.map((project) => {
        return {
          id: parseInt(project.id),
          name: project.name,
          username: project.username,
          description: project.description ?? undefined,
          startingBalance: project.starting_balance ? parseFloat(project.starting_balance) : undefined,
          risk: project.risk ? parseFloat(project.risk) : undefined,
          createdOn: new Date(project.created_on),
          updatedOn: new Date(project.updated_on),
          tags: project.tags ?? []
        } as Project;
      });
    });
};

export const getPinnedProjects = async (username: string): Promise<Project[]> => {
  return api.get(`/users/${username}/pinned`)
    .then(({ data }) => {
      return data.map((project) => {
        return {
          id: parseInt(project.id),
          name: project.name,
          username: project.username,
          description: project.description ?? undefined,
          startingBalance: project.starting_balance ? parseFloat(project.starting_balance) : undefined,
          risk: project.risk ? parseFloat(project.risk) : undefined,
          createdOn: new Date(project.created_on),
          updatedOn: new Date(project.updated_on),
          tags: project.tags ?? [],
          pinned: true,
          stars: Number(project.stars)
        } as Project;
      });
    });
};