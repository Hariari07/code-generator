// generate-all.js
const { generateAll } = require("./tableGenerator");

const args = process.argv.slice(2);
const entity = args[0];

if (!entity) {
  console.error('Usage: node generate-all.js <entity> --columns="col1,col2,..." [--db=dbname]');
  process.exit(1);
}

const opts = {};
for (const a of args.slice(1)) {
  if (a.startsWith("--columns=")) {
    opts.columns = a.replace("--columns=","");
  } else if (a.startsWith("--db=")) {
    opts.db = a.replace("--db=","");
  }
}

generateAll(entity, opts)
  .then(()=>console.log("Generation completed."))
  .catch(err=>console.error("Error:", err));
