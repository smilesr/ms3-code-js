const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const Papa = require('papaparse')
const { convertArrayToCSV } = require('convert-array-to-csv')

let recordCount = 0, successCount = 0, failureCount = 0, successList = [], failureList = [], headers = []

// Read and parse data from .csv file
const data = fs.readFileSync('./cleanedms3Interview.csv','utf8')
const parsedData = Papa.parse(data)

for (let i in parsedData.data){
  if (i === "0"){
    // Get column names
    headers = parsedData.data[i]
  } else {
    // Count records
    recordCount ++
    // Separate records that are missing data fields
    if (Object.values(parsedData.data[i]).every(item => item)){
      // Count records that have all data fields
      successCount ++
      successList.push(parsedData.data[i])
    } else {
      // Count records that are missing data fields
      failureCount ++
      failureList.push(parsedData.data[i])
    }
  }
}

let [column1, column2, column3, column4, column5, column6, column7, column8, column9, column10] = headers

// Create a SQLite table
let createSql = "CREATE TABLE interviews(" + column1 + " text " + ", " + column2 + " text" +  ", " + column3 + " text" +  ", " + column4 + " text" +  ", " + column5 + " text" +  ", " + column6 + " text" +  ", " + column7 + " text" +  ", " + column8 + " text" +  ", " + column9 + " text" +  ", " + column10 + " text)"

let db = new sqlite3.Database('./interviews.db')

db.serialize(() => {
  // Insert valid records into SQLite table
  db.run(createSql)
  for (let j = 0; j<successList.length; j++){
    let sql = "INSERT INTO interviews(" + column1 + "," + column2 + "," + column3 + "," + column4 + "," + column5 + "," + column6 + "," + column7 + "," + column8 + "," + column9 + "," + column10 +") VALUES (?,?,?,?,?,?,?,?,?,?)"
  
    db.run(sql, successList[j] , function(err) {
      if (err) {
        return console.error(err.message)
      }
    })
  }
})
db.close()

// Create log showing statistics from parsing records
const writeStreamLog = fs.createWriteStream('./output.log')
writeStreamLog.write(`${recordCount} total records received
${successCount} record${successCount > 1 ? 's' : ''} contained 10 data elements
${failureCount} record${failureCount > 1 ? 's' : ''} did not have all 10 data elements`)
writeStreamLog.end()

// Create csv file for records that are missing data fields
const csvFromArrayOfArrays = convertArrayToCSV(failureList, {
  header: headers,
  separator: ','
});

fs.writeFile('./output-bad.csv', csvFromArrayOfArrays, 'utf8', () => console.log('Completed'))