import axios from "axios";
import Logger from "../workers/logger.js";
import { WriteFile } from "../workers/loadfile.js";

let bearer;
let api = axios.create({ baseURL: 'https://api.spotify.com/v1/', headers: { 'Authorization': 'Bearer ' + bearer }, json: true });

export default class Reddit {
    
    static token_get(config, service, i) {
        console.log(config.services)    
        if(config.services[i].updated < (Date.now() + 29 * 60 * 1000)){
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
                bearer = data.data.access_token;
                api.defaults.headers['Authorization'] = 'Bearer ' + bearer;
                Logger.dbg(`Updated Reddit Bearer to ${bearer}`);
                WriteFile.cfg(config, i);
            }).catch(err => {
                Logger.warn(err);
            });
        } else Logger.dbg(`Reddit bearer still valid!`);
    };
    
    
    
    static async notif_get(config, service, i){
        await this.token_get(config, service, i);
    };
};