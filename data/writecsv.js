const reports = require("./outputs/hoodsDataWithRegions.json");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "outputs/PhillyHoodsRecords_withReportIds.csv",
  header: [
    { id: "title", title: "TITLE" },
    { id: "year", title: "YEAR" },
    { id: "callNumber", title: "CALL NUMBER" },
    { id: "reportId", title: "REPORT ID" },
  ]
});

let records = [];
for (let i = 0; i < reports.length; i++) {
  const oneRecord = {
    title: `${reports[i].bibliographicData.title}`,
    year: `${reports[i].bibliographicData.year}`,
    callNumber: `${reports[i].bibliographicData.callNumber}`,
    reportId: `${reports[i].report.id}`
  };
  records.push(oneRecord);
}

csvWriter
  .writeRecords(records)
  .then(() => {
    console.log("...Done");
  });