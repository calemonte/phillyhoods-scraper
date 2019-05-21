const reports = require("./outputs/hoodsDataWithRegions.json");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "outputs/testOmekaOutput.csv",
  header: [
    { id: "reportId", title: "REPORT ID" },
    { id: "title", title: "TITLE" },
    { id: "year", title: "YEAR" },
    { id: "creator", title: "CREATOR" },
    { id: "contributor", title: "CONTRIBUTOR" },
    { id: "region", title: "REGION" },
    { id: "neighborhoods", title: "REGION NEIGHBORHOODS" },
    { id: "callNumber", title: "CALL NUMBER" },
    { id: "tocs", title: "TABLE OF CONTENTS" },
    { id: "path", title: "PATH" }
  ]
});

let records = [];
for (let i = 0; i < reports.length; i++) {
  const creator = reports[i].bibliographicData.creator
    ? reports[i].bibliographicData.creator
    : reports[i].bibliographicData.contributor ||
      "Philadelphia City Planning Commission";

  const contributor = reports[i].bibliographicData.contributor
    ? reports[i].bibliographicData.contributor
    : "";

  const region = reports[i].bibliographicData.region
    ? reports[i].bibliographicData.region
    : "";

  const neighborhoods = reports[i].bibliographicData.regionNeighborhoods
    ? reports[i].bibliographicData.regionNeighborhoods
    : "";

  let tocs = [];
  for (let j = 0; j < reports[i].tocs.length; j++) {
    const entry = `pp. ${reports[i].tocs[j].pageNumber}: ${
      reports[i].tocs[j].pageTitle
    }`;
    tocs.push(entry);
  }

  const oneRecord = {
    reportId: `${reports[i].report.id}`,
    title: `${reports[i].bibliographicData.title}`,
    year: `${reports[i].bibliographicData.year}`,
    creator: `${creator}`,
    contributor: `${contributor}`,
    region: `${region}`,
    neighborhoods: `${neighborhoods}`,
    callNumber: `${reports[i].bibliographicData.callNumber}`,
    tocs: `${tocs}`,
    path: ""
  };
  records.push(oneRecord);
}

csvWriter.writeRecords(records).then(() => {
  console.log("...Done");
});
