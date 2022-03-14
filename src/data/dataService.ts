import { OrmDatabase } from "./ormDatabase";

const database = new OrmDatabase();

const dataService = async (request, response, next) => {
  request.dataService = database;
  next();
};

export default dataService;