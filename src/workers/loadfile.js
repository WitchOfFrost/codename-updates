import fs from "fs";
import Logger from "./logger.js";

let configData;

export default class LoadFile {
    static cfg() {
        try {
        configData = fs.readFileSync('./src/json/config.json', 'utf-8');
    } catch (e){
        Logger.err(e);
    } finally {
        Logger.dbg(configData);
        return(configData);
    }
}};