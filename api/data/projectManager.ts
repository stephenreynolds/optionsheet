import { Pool } from "pg";
import { logError } from "../error";
import { ProjectCreateModel, ProjectUpdateModel } from "./models/project";

export class ProjectManager {
  private readonly pool: Pool;

  constructor(pool) {
    this.pool = pool;
  }

  async getUserProjects(userUUID: string) {
    try {
      const res = await this.pool.query(`
          SELECT project.*, COUNT(starred_project) stars
          FROM project
                   LEFT JOIN starred_project ON project_id = project.id
          WHERE project.user_uuid = $1
          GROUP BY project.id
      `, [userUUID]);

      return res.rows;
    }
    catch (error) {
      logError(error, "Failed to get user's projects");
    }
  }

  async getProjectById(id: number) {
    try {
      const res = await this.pool.query(`
          SELECT project.*, COUNT(starred_project) stars
          FROM project
                   LEFT JOIN starred_project ON project_id = project.id
          WHERE project.id = $1
          GROUP BY project.id
      `, [id]);

      return res.rows[0];
    }
    catch (error) {
      logError(error, "Failed to get project by name");
    }
  }

  async getProjectByName(userUUID: string, name: string) {
    try {
      const res = await this.pool.query(`
          SELECT project.*, COUNT(starred_project) stars
          FROM project
                   LEFT JOIN starred_project ON project_id = project.id
          WHERE project.user_uuid = $1
            AND project.name = $2
          GROUP BY project.id
      `, [userUUID, name]);

      return res.rows[0];
    }
    catch (error) {
      logError(error, "Failed to get project by name");
    }
  }

  async addProject(userUUID: string, model: ProjectCreateModel) {
    try {
      const res = await this.pool.query(`
          INSERT INTO project(user_uuid, name, description, starting_balance, risk)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id
      `, [userUUID, model.name, model.description, model.starting_balance, model.risk]);

      await this.addProjectTags(res.rows[0].id, model.tags);

      return res.rows[0];
    }
    catch (error) {
      logError(error, "Failed to create project");
    }
  }

  async updateProject(id: number, model: ProjectUpdateModel) {
    try {
      const res = await this.pool.query(`
          UPDATE project
          SET name             = COALESCE($2, name),
              description      = COALESCE($3, description),
              starting_balance = COALESCE($4, starting_balance),
              risk             = COALESCE($5, risk)
          WHERE id = $1
          RETURNING *
      `, [id, model.name, model.description, model.starting_balance, model.risk]);

      return res.rows[0];
    }
    catch (error) {
      logError(error, "Failed to update project");
    }
  }

  async deleteProject(id: number) {
    try {
      await this.pool.query(`
          DELETE
          FROM project
          WHERE id = $1
      `, [id]);
    }
    catch (error) {
      logError(error, "Failed to delete project");
    }
  }

  async getProjectTags(id: number) {
    try {
      const res = await this.pool.query(`
          SELECT id, name
          FROM tag
                   LEFT JOIN project_tag ON project_tag.tag_id = tag.id
          WHERE project_tag.project_id = $1
      `, [id]);

      return res.rows;
    }
    catch (error) {
      logError(error, "Failed to get project tags");
    }
  }

  async addProjectTags(id: number, tags: string[]) {
    for (const newTag of tags) {
      const name = newTag.trim().toLowerCase();

      await this.pool.query(`
          INSERT INTO tag(name)
          VALUES ($1)
          ON CONFLICT DO NOTHING
      `, [name]);

      const tag = await this.pool.query(`
          SELECT id, name
          FROM tag
          WHERE name = $1
      `, [name]);

      const tagId = tag.rows[0].id;

      await this.pool.query(`
          INSERT INTO project_tag(project_id, tag_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
      `, [id, tagId]);
    }
  }

  async getProjectsByName(name: string, offset, limit?: number): Promise<any> {
    try {
      const projects = await this.pool.query(`
          SELECT project.id,
                 project.name,
                 project.description,
                 project.updated_on,
                 app_user.username,
                 COUNT(trade) trades
          FROM project
                   LEFT JOIN app_user ON app_user.uuid = project.user_uuid
                   LEFT JOIN trade ON trade.project_id = project.id
          WHERE LOWER(name) LIKE LOWER($1)
          GROUP BY project.id,
                   project.name,
                   project.description,
                   project.updated_on,
                   app_user.username
          OFFSET COALESCE($2, 0) * $3 LIMIT $2
      `, [name, limit, offset]);

      for (let i = 0; i < projects.rows.length; ++i) {
        const tags = await this.getProjectTags(projects.rows[i].id);
        projects.rows[i].tags = tags.map((tag) => tag.name);
      }

      return projects.rows;
    }
    catch (error) {
      logError(error, "Failed to get projects by name");
    }
  }

  async getProjectMatches(term: string) {
    try {
      const res = await this.pool.query(`
          SELECT COUNT(project)
          FROM project
          WHERE LOWER(name) LIKE LOWER($1)
      `, [term]);

      return res.rows[0].count;
    }
    catch (error) {
      logError(error, "Failed to get project match count");
    }
  }
}