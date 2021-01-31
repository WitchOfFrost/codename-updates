import axios from "axios";
import Logger from "../workers/logger.js";
import { WriteFile } from "../workers/loadfile.js";
import SendHook from "../workers/sendhook.js";

let bearer;
let firstrun = 1;
let api = axios.create({ baseURL: 'https://oauth.reddit.com/', headers: { 'Authorization': 'Bearer ' + bearer, "User-Agent": "desktop:com.witchoffrost.redditupdates:v1.0.0 (by /u/witchoffrost)" }, json: true });

export default class Reddit {

    static token_get(config, service, i) {

        if (firstrun == 1) {
            firstrun = 0;
            api.defaults.headers['Authorization'] = 'Bearer ' + config.services[i].bearercache;
        }

        if ((config.services[i].updated + 59 * 60 * 1000) < Date.now()) {
            Logger.dbg("Reddit Bearer timed out, refreshing...");
            axios({
                url: "https://www.reddit.com/api/v1/access_token",
                method: "post",
                params: {
                    grant_type: "password",
                    "username": service.username,
                    "password": service.password
                },
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "User-Agent": "desktop:com.witchoffrost.redditupdates:v1.0.0 (by /u/witchoffrost)"
                },
                auth: {
                    username: service.clientid,
                    password: service.clientsecret
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



        try {
            this.token_get(config, service, i)
        } finally {

            let res = await api.get(encodeURI(`message/unread.json`));

            if (res.data.data.dist > 0) {
                let body = {
                    embeds: [{
                        "title": `You have ${res.data.data.dist} new Message(s)!`,
                        "fields": []
                    }]
                };

                await res.data.data.children.forEach(function (child, i) {
                    body.embeds[0].fields[i] = { name: `From: ${child.data.author}, Subject: ${child.data.subject}`, value: child.data.body };
                });

                try {
                    SendHook.default(config.webhook_url, body);
                } catch (e) {
                    Logger.warn(e);
                }

            };

        };
    };
};