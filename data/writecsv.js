const reports = require("./outputs/hoodsDataWithRegions.json");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "outputs/PhillyHoodsRecords.csv",
  header: [
    { id: "title", title: "TITLE" },
    { id: "year", title: "YEAR" },
    { id: "callNumber", title: "CALL NUMBER" }
  ]
});

let records = [];
for (let i = 0; i < reports.length; i++) {
  const oneRecord = {
    title: `${reports[i].bibliographicData.title}`,
    year: `${reports[i].bibliographicData.year}`,
    callNumber: `${reports[i].bibliographicData.callNumber}`
  };
  records.push(oneRecord);
}

csvWriter
  .writeRecords(records)
  .then(() => {
    console.log("...Done");
  });