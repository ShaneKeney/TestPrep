# TestPrep
Test Prep application for electronically completing SAT/ACT practice tests and getting relevant results on a per question basis

## Local Installation and Setup:

Create a file named `.env` in the repo's root directory and copy the contents from `.env-example`.  Fill in the `.env` file for the specified fields.

When seeding your local database, populate tables in the following order: 
- 
-
- questions_seeds.csv
-
-
-

Start the server so that Sequelize initializes the tables in the database, then use MySQL Workbench's data import wizard to import the data from the .csv files in the db folder.

//TODO: Add JWT_SECRET to Heroku projects -> staging & prod