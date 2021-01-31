import axios from "axios";
import Logger from "../workers/logger.js";
import { WriteFile } from "../workers/loadfile.js";

let bearer;
let firstrun = 1;
let api = axios.create({ baseURL: 'https://www.reddit.com/api/v1/access_token', headers: { 'Authorization': 'Bearer ' + bearer }, json: true });

export default class Reddit {

    static token_get(config, service, i) {

        if (firstrun == 1) {
            firstrun = 0;
            api.defaults.headers['Authorization'] = 'Bearer ' + config.services[i].bearercache;
        }

        if (config.services[i].updated > (Date.now() + 29 * 60)) {
            Logger.dbg("Reddit Bearer timed out, refreshing...");
            axios({
                url: "https://www.reddit.com/api/v1/access_token",
                method: "post",
                params: {
                    grant_type: "client_credentials"
                },
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                auth: {
                    username: `${service.clientid}`,
                    password: `${service.clientsecret}`
                }
            }).then(data => {
                try {
                    bearer = data.data.access_token;
                    api.defaults.headers['Authorization'] = 'Bearer ' + bearer;
                    Logger.dbg(`Updated Reddit Bearer to ${bearer}`);
                } finally {
                    WriteFile.cfg(config, i, bearer);
                }
            }).catch(err => {
                Logger.warn(err);
            });
        } else Logger.dbg(`Reddit bearer still valid!`);
    };



    static async notif_get(config, service, i) {
        await this.token_get(config, service, i);
    };
};