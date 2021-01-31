import fs from "fs";
import Logger from "./logger.js";

let configData;

export default class ReadFile {
    static cfg() {
        try {
        configData = fs.readFileSync('./src/json/config.json', 'utf-8');
    } catch (e){
        Logger.err(e);
    } finally {
        Logger.dbg(`Read config from file: ${configData}`);
        return(configData);
    }
}};

export class WriteFile {
    static cfg(cfg, i) {
        try {
            cfg.services[i].updated = Date.now();
            let configData = JSON.stringify(cfg);
            fs.writeFileSync('./src/json/config.json', configData, 'utf-8'); 
        } catch(e) {
            Logger.err(e);
        } finally {
            Logger.dbg(`Wrote config to file: ${configData}`);
            return("Success");
        }
    }
}