# ms3-code-js

The objectives are:

1. Consume a CSV file, parse the data, and insert valid records into a SQLite DB.
2. Verify each record needs to ensure it contains the right number of data elements (10).
3. Write the records that did not have the right number of data elements to a .csv file.
4. After processing the data, write the following information to a .log file: a. # of records received b. # of records successful c. # of records failed

Program requirements:

1. SQLite3: https://www.sqlite.org/index.html
2. Node & NPM: https://nodejs.org/en/download/

Instructions to run program (on MAC):

1. After installing SQLite3 and Node/NPM, run "npm install" on command line.
2. Run "node index.js" on command line.
3. Output should include output-bad.csv file, an output.log file and a interviews.db file.

Additional notes:

1. I cleaned up the data before running the program to eliminate all of the extra trailing commas.  I did this by running:

sed 's/,,,,,//g' ms3Interview-copy.csv > cleanedms3Interview.csv

The cleaned-up .csv file is what is included in this directory.
