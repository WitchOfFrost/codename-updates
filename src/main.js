import LoadFile from "./workers/loadfile.js";

let config;

async function main(){
    config = await JSON.parse(LoadFile.cfg());
};
main();