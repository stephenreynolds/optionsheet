import faker from "@faker-js/faker";
import bcrypt from "bcrypt";
import _ from "lodash";
import { PutCall, Side } from "../entities/leg";
import { Trade } from "../entities/trade";
import { User } from "../entities/user";
import { OrmDatabase } from "../ormDatabase";

enum TestStrategy {
  Shares,
  Single,
  Vertical,
  IronCondor,
  Straddle
}

const generateShares = (closed) => {
  return [{
    side: faker.datatype.boolean() ? Side.Buy : Side.Sell,
    quantity: faker.datatype.number({ min: 1, max: 100 }),
    openPrice: faker.datatype.float({ min: 10, max: 400, precision: 0.01 }),
    closePrice: closed ? faker.datatype.float({ min: 10, max: 400, precision: 0.01 }) : null
  }];
};

const generateSingle = (closed, openDate) => {
  const side = faker.datatype.boolean() ? Side.Buy : Side.Sell;
  const dte = faker.datatype.number({ min: 0, max: 100 });
  const expMax = new Date(openDate);
  expMax.setDate(expMax.getDate() + dte);
  const quantity = faker.datatype.number({ min: 1, max: 10 });

  return [
    {
      side,
      quantity,
      putCall: faker.datatype.boolean() ? PutCall.Call : PutCall.Put,
      expiration: faker.date.between(openDate.toISOString(), expMax.toISOString()),
      strike: faker.datatype.number({ min: 10, max: 300 }),
      openPrice: faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }),
      closePrice: closed ? faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }) : null
    }
  ];
};

const generateVertical = (closed, openDate) => {
  const putCall = faker.datatype.boolean() ? PutCall.Call : PutCall.Put;
  const dte = faker.datatype.number({ min: 0, max: 100 });
  const expMax = new Date(openDate);
  expMax.setDate(expMax.getDate() + dte);
  const expiration = faker.date.between(openDate.toISOString(), expMax.toISOString());
  const quantity = faker.datatype.number({ min: 1, max: 10 });
  const strike1 = faker.datatype.number({ min: 20, max: 300 });

  const width = faker.datatype.number({ min: 1, max: 10 });

  return [
    {
      side: Side.Buy,
      putCall,
      quantity,
      expiration,
      strike: strike1,
      openPrice: faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }),
      closePrice: closed ? faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }) : null
    },
    {
      side: Side.Sell,
      putCall,
      quantity,
      expiration,
      strike: strike1 + (faker.datatype.boolean() ? 1 : -1) * faker.datatype.number({ min: 1, max: width }),
      openPrice: faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }),
      closePrice: closed ? faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }) : null
    }
  ];
};

const generateIronCondor = (closed, openDate) => {
  const dte = faker.datatype.number({ min: 0, max: 100 });
  const expMax = new Date(openDate);
  expMax.setDate(expMax.getDate() + dte);
  const expiration = faker.date.between(openDate.toISOString(), expMax.toISOString());
  const quantity = faker.datatype.number({ min: 1, max: 10 });

  const atm = faker.datatype.number({ min: 20, max: 300 });
  const dist = faker.datatype.number({ min: 1, max: 10 });
  const width = faker.datatype.number({ min: 1, max: 5 });

  return [
    {
      side: Side.Buy,
      putCall: PutCall.Call,
      quantity,
      expiration,
      strike: atm + dist + width,
      openPrice: faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }),
      closePrice: closed ? faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }) : null
    },
    {
      side: Side.Sell,
      putCall: PutCall.Call,
      quantity,
      expiration,
      strike: atm + dist,
      openPrice: faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }),
      closePrice: closed ? faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }) : null
    },
    {
      side: Side.Buy,
      putCall: PutCall.Put,
      quantity,
      expiration,
      strike: atm - dist - width,
      openPrice: faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }),
      closePrice: closed ? faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }) : null
    },
    {
      side: Side.Sell,
      putCall: PutCall.Put,
      quantity,
      expiration,
      strike: atm - dist,
      openPrice: faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }),
      closePrice: closed ? faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }) : null
    }
  ];
};

const generateStraddle = (closed, openDate) => {
  const side = faker.datatype.boolean() ? Side.Buy : Side.Sell;
  const dte = faker.datatype.number({ min: 0, max: 100 });
  const expMax = new Date(openDate);
  expMax.setDate(expMax.getDate() + dte);
  const expiration = faker.date.between(openDate.toISOString(), expMax.toISOString());
  const quantity = faker.datatype.number({ min: 1, max: 10 });

  const atm = faker.datatype.number({ min: 20, max: 300 });
  const dist = faker.datatype.number({ min: 0, max: 10 });

  return [
    {
      side,
      putCall: PutCall.Call,
      quantity,
      expiration,
      strike: atm + dist,
      openPrice: faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }),
      closePrice: closed ? faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }) : null
    },
    {
      side,
      putCall: PutCall.Put,
      quantity,
      expiration,
      strike: atm - dist,
      openPrice: faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }),
      closePrice: closed ? faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }) : null
    }
  ];
};

export const createTestData = async (database: OrmDatabase) => {
  const totalUsers = 10000;
  const maxProjectsPerUser = 10;
  const maxTradesPerProject = 1000;
  const tagCount = 50;

  try {
    const role = await database.getRoleByName("user");

    // Tags
    const tagList = _.uniq(faker.random.words(tagCount).toLowerCase().split(" "));
    for (const t of tagList) {
      await database.createTag(t);
    }

    for (let userCount = 0; userCount < totalUsers; ++userCount) {
      // Create user
      const password = faker.internet.password();
      const newUser: User = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        emailConfirmed: faker.datatype.boolean(),
        passwordHash: await bcrypt.hash(password, 12),
        roles: [role],
        bio: `Password: ${password} ${faker.lorem.paragraph(3)}`,
        avatarUrl: faker.internet.avatar()
      };
      const createdUser = await database.saveUser(newUser);

      for (let projectCount = 0; projectCount < faker.datatype.number({
        min: 0,
        max: maxProjectsPerUser
      }); ++projectCount) {
        // Project
        const newProject = {
          name: faker.random.words(),
          description: faker.datatype.boolean() ? faker.lorem.sentences(1) : null,
          startingBalance: faker.datatype.boolean() ? faker.datatype.float({
            min: 500,
            max: 100000,
            precision: 0.01
          }) : null,
          risk: faker.datatype.boolean() ? faker.datatype.number({ min: 1, max: 5 }) : null,
          user: createdUser.id,
          lastEdited: new Date(),
          tags: faker.datatype.boolean() ? tagList.sort(() => 0.5 - Math.random()).slice(0, 5).map((tag) => {
            return { name: tag };
          }) : []
        };
        const createdProject = await database.saveProject(newProject);

        for (let tradeCount = 0; tradeCount < faker.datatype.number({
          min: 0,
          max: maxTradesPerProject
        }); ++tradeCount) {
          // Trade
          const openDate = faker.date.between("2010-01-01", new Date().toISOString());
          const closed = faker.datatype.boolean();
          let legs;

          const strategy = faker.datatype.number({ min: 0, max: 3 });
          switch (strategy) {
            case TestStrategy.Shares:
              legs = generateShares(closed);
              break;
            case TestStrategy.Single:
              legs = generateSingle(closed, openDate);
              break;
            case TestStrategy.Vertical:
              legs = generateVertical(closed, openDate);
              break;
            case TestStrategy.IronCondor:
              legs = generateIronCondor(closed, openDate);
              break;
            case TestStrategy.Straddle:
              legs = generateStraddle(closed, openDate);
              break;
          }

          const newTrade: Trade = {
            symbol: faker.random.word().slice(0, 3).toUpperCase(),
            legs,
            openDate,
            closeDate: closed ? faker.date.between(openDate.toISOString(), new Date().toISOString()) : null,
            openingNote: faker.datatype.boolean() ? faker.lorem.sentence() : null,
            closingNote: closed ? faker.datatype.boolean() ? faker.lorem.sentence() : null : null,
            project: createdProject,
            tags: faker.datatype.boolean() ? tagList.sort(() => 0.5 - Math.random()).slice(0, 5).map((tag) => {
              return { name: tag };
            }) : []
          };
          await database.saveTrade(newTrade);
        }
      }
    }
  }
  catch (error) {
    console.log(error);
  }
};