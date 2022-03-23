import { Pool } from "pg";
import { logError } from "../error";
import { ProjectCreateModel, ProjectUpdateModel } from "./models/project";

export class ProjectManager {
  private readonly pool: Pool;

  constructor(pool) {
    this.pool = pool;
  }

  public async getUserProjects(userUUID: string) {
    try {
      const res = await this.pool.query(`
          SELECT *
          FROM project
          WHERE user_uuid = $1
      `, [userUUID]);

      return res.rows;
    }
    catch (error) {
      logError(error, "Failed to get user's projects");
    }
  }

  public async getProjectByName(userUUID: string, name: string) {
    try {
      const res = await this.pool.query(`
          SELECT *
          FROM project
          WHERE project.user_uuid = $1
            AND project.name = $2
      `, [userUUID, name]);

      return res.rows[0];
    }
    catch (error) {
      logError(error, "Failed to get project by name");
    }
  }

  public async addProject(userUUID: string, model: ProjectCreateModel) {
    try {
      const res = await this.pool.query(`
          INSERT INTO project(user_uuid, name, description, starting_balance)
          VALUES ($1, $2, $3, $4)
          RETURNING id
      `, [userUUID, model.name, model.description, model.starting_balance]);

      await this.addProjectTags(res.rows[0].id, model.tags);

      return res.rows[0];
    }
    catch (error) {
      logError(error, "Failed to create project");
    }
  }

  public async updateProject(id: number, model: ProjectUpdateModel) {
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

  public async deleteProject(id: number) {
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

  public async getProjectTags(id: number) {
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

  public async addProjectTags(id: number, tags: string[]) {
    for (const newTag of tags) {
      const name = newTag.trim().toLowerCase();

      let tag = await this.pool.query(`
          SELECT id, name
          FROM tag
          WHERE name = $1
      `, [name]);

      if (!tag.rows.length) {
        tag = await this.pool.query(`
            INSERT INTO tag(name)
            VALUES ($1)
            RETURNING id, name
        `, [name]);
      }

      const tagId = tag.rows[0].id;

      await this.pool.query(`
          INSERT INTO project_tag(project_id, tag_id)
          VALUES ($1, $2)
      `, [id, tagId]);
    }
  }
}