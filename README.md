# TestPrep
Test Prep application for electronically completing SAT/ACT practice tests and getting relevant results on a per question basis

## Local Installation and Setup:

Create a file named `.env` in the repo's root directory and give it the following contents:

```
DBUSERNAME=Your_Username_Here
DBPASS=Your_Password_Here
DBNAME=Your_Database_Name_Here
DBHOST=127.0.0.1
```

Be sure to create the database with the name as specified in the .env file.

Start the server so that Sequelize initializes the tables in the database, then use MySQL Workbench's data import wizard to import the data from the .csv files in the db folder.
