import MockDatabase from "./mockDatabase";

const database = new MockDatabase();

const mockDataService = async (request, response, next) => {
  request.dataService = database;
  next();
};

export default mockDataService;