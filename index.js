import { createReadStream, createWriteStream } from "fs";
import { Transform } from "stream";

function transformFile(inputFile, outputFile, operation) {
  const operations = {
    uppercase(data) {
      return data.toString().toUpperCase();
    },
    lowercase(data) {
      return data.toString().toLowerCase();
    },
    reverse(data) {
      return data.toString().split("").reverse().join("");
    },
  };

  if (operations.hasOwnProperty(operation)) {
    const myTransform = new Transform({
      transform(chunk, encoding, callback) {
        callback(null, operations[operation](chunk));
      },
    });
    const readStream = createReadStream(inputFile);
    readStream.on("error", (err) => {
      console.error("File not found!");
    });
    const writeStream = createWriteStream(outputFile);
    writeStream.on("error", (err) => {
      console.error(err.message);
    });
    readStream.pipe(myTransform).pipe(writeStream);
  } else {
    console.error("Invalid operation!");
  }
}

const args = process.argv.slice(2);
transformFile(args[0], args[1], args[2]);
