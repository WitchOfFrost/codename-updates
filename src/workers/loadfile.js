import fs from "fs";
import Logger from "./logger.js";

let configData;
let json_string;

export default class ReadFile {
    static cfg() {
        try {
            configData = fs.readFileSync('./src/json/config.json', 'utf-8');
        } catch (e) {
            Logger.err(e);
        } finally {
            Logger.dbg(`Read config from file: ${configData}`);
            return (configData);
        }
    };

    static services() {
        try {
            configData = fs.readFileSync('./src/json/services.json', 'utf-8');
        } catch (e) {
            Logger.err(e);
        } finally {
            Logger.dbg(`Read services from file: ${configData}`);
            return (configData);
        }
    }

};

export class WriteFile {
    static cfg(config, i, bearer) {
        try {
            config.services[i].updated = Date.now();
            config.services[i].bearercache = bearer
            json_string = JSON.stringify(config)

            fs.writeFileSync('./src/json/config.json', json_string);
        } catch (e) {
            Logger.err(e);
        } finally {
            Logger.dbg(`Wrote config to file: ${json_string}`);
            return ("Success");
        }
    }
}