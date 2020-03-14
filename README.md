# TestPrep

Test Prep application for electronically completing SAT practice tests and getting relevant results on a per question basis. This app is meant to be used by educators who will be grading the official [SAT Practice Tests](https://collegereadiness.collegeboard.org/sat/practice/full-length-practice-tests) as published by the College Board. Educator can sign in to this app and enter students' responses to get detailed reports of how well students do and what areas need further study.

This app was created with ❤️ by [Jess Butler](https://github.com/JessButler16), [Shane Keney](https://github.com/ShaneKeney), [Jeremy Marotta](https://github.com/firefreet), [Zachary Rosensohn](https://github.com/zrosensohn), and [Nathan Sartain](https://github.com/NatePad).

## Local Installation and Setup:

This app uses and requires [Node.js](https://nodejs.org/en/) and [MySQL](https://dev.mysql.com/downloads/).

1. Clone the repo to your machine and use your terminal to `cd` into the repo's root folder (the same location as the `package.json` file).
2. Create a file named `.env` in the repo's root directory and copy the contents from `.env-example` into the .env file and update the necessary fields.
3. Be sure to create the local database that you will be using.
4. In your terminal, be sure you're in the repo's root folder, then run the command `npm i` to install all the necessary Node.js packages.
5. Run the command `node .` to start the server. Doing so will allow [Sequelize](https://sequelize.org/) to create the database tables.
6. Once the database tables have been created, use your preferred method run the `/seeds/allSeeds.sql` seed file to populate the database.
7. Finally, navigate to `localhost:3000` to access the running application.
https://docs.google.com/presentation/d/16JTgXNH6D9AW0Dnst7UzmV0WvhKRvJFxJO43JoxECzc/edit#slide=id.p6
