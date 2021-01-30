import axios from "axios";
import Logger from "./logger.js";

export default class SendHook {
    static default(webhook_url, body) {

        let axiosconfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        axios.post(webhook_url, body, axiosconfig).catch(err => {
            Logger.warn(err);
            console.log(err)
        });
    }
};