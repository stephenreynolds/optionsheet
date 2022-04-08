import { GetProjectDto } from "../projects/projectDtos";
import { GetTradeDto } from "../trades/tradeDtos";
import { GetUserDto } from "../users/usersDtos";

export interface SearchDto {
  items: GetTradeDto[] | GetProjectDto[] | GetUserDto[];
  counts: {
    trades: number;
    projects: number;
    users: number;
  }
}