// const fs = require("fs");

// fs.readdir("./test", (error, files) => {
//   try {
//     // Loop over our files and extract the unique ids.
//     for (let i = 0; i < files.length; i++) {
//       const stats = fs.statSync(files[i]);
//       const fileSizeInBytes = stats.size;
//       const fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
//       console.log(`${files[i]}: ${fileSizeInMegabytes}mb`);
//     }

//   } catch (error) {
//     console.log(error);
//   }

//   console.log("File Read Error: " + error);
// });

const path = require("path");
const fs = require("fs");

const getFileInfoFromFolder = route => {
  const files = fs.readdirSync(route, "utf8");
  const response = [];
  try {
    for (let file of files) {
      const extension = path.extname(file);
      const fileSizeInBytes = fs.statSync(file).size;
      response.push({ name: file, extension, fileSizeInBytes });
    }
  } catch (error) {
    console.log(error);
  }

  return response;
};

const { name, extenstion, fileSizeInBytes } = getFileInfoFromFolder("../../../Desktop/NeighborhoodsSecondImageSafehouse/images");
