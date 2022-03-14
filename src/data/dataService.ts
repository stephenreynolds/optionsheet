import { TypeORMDatabase } from "./typeormDatabase";

const database = new TypeORMDatabase();

const dataService = async (request, response, next) => {
  request.dataService = database;
  next();
};

export default dataService;