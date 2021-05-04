[![master](https://github.com/stephenreynolds/optionsheet/actions/workflows/master.yml/badge.svg)](https://github.com/stephenreynolds/optionsheet/actions/workflows/master.yml)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/22b39e1f459f466ba99a2bfa78506613)](https://app.codacy.com/gh/stephenreynolds/optionsheet?utm_source=github.com&utm_medium=referral&utm_content=stephenreynolds/optionsheet&utm_campaign=Badge_Grade_Settings)

# OptionSheet

A platform for logging and analyzing stock and option trades. Built with React and Express.

## Running

- Install [postgreSQL](https://postgresql.org) and create a database.
- Make a copy of `.env.sample` named `.env`, and set your database credentials and other environment variables.
- Run `npm install` to install dependencies.

### Production
Run `npm run build` then `npm run start` to build and start the server.
The client can be accessed on `http://localhost:4001`.

### Development

Run `npm run start:dev` to build and run while watching for changes.
In development, the client is served on `http://localhost:4000`. Navigating to 
`http://localhost:4001` will redirect there.
