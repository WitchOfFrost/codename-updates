import { exit } from "process";
import configData from "./loadfile.js";

export default class Logger {
    
    static err(msg) {
        console.log("\x1b[31m",`[${new Date(Date.now()).toLocaleString()}] ` + `!ERR:` +" "+ msg +"\n" + `Exiting...`);
        exit(1);
    };
    
    static warn(msg) {
        if (configData.loglvl < 1) return;
        console.log("\x1b[33m",`[${new Date(Date.now()).toLocaleString()}] ` + `!WARN:` +" "+ msg);
    };

    static info(msg){
        if (configData.loglvl < 2) return;
        console.log("\x1b[37m",`[${new Date(Date.now()).toLocaleString()}] ` + `!INFO:` +" "+ msg);
    };

    static dbg(msg) {
        if (configData.loglvl < 3) return;
        console.log("\x1b[36m",`[${new Date(Date.now()).toLocaleString()}] ` + `!DBG:` +" "+ msg);
    };
};