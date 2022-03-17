export interface Database {
  // User
  getUserById(id: number);
  getUserByName(username: string);
  getUserByEmail(email: string);
  saveUser(user);
  updateUserById(id: number, user);
  deleteUserById(id: number);

  // Role
  getRoleByName(name: string);

  // Refresh token
  getRefreshToken(refreshToken: string);
  removeRefreshToken(refreshToken);

  // Project
  getProjectsByUserId(userId: number);
  getProject(userId: number, name: string);
  saveProject(project);
  deleteProject(project);
  onProjectUpdated(project);

  // Trade
  getTradesByProject(project);
  getTradeById(id: number);
  getTradesBySymbol(symbol: string, limit?: number, offset?: number);
  getTradeWithProject(id: number);
  saveTrade(trade);
  deleteTrade(id: number);

  // Tokens
  createToken(user): Promise<string>
  createRefreshToken(user): Promise<string>;
}