import Logger from "./workers/logger.js";
import ReadFile from "./workers/loadfile.js";
import Index from "./services/routes.js";

let config;
let services;


function main() {
    async function check() {

        Logger.info("Running check()");

        config = await JSON.parse(ReadFile.cfg());
        services = await JSON.parse(ReadFile.services())


        config.services.forEach(function (service, i) {
            if (services.supported_services.includes(service.sid)) {
                switch (service.sid) {
                    case "reddit":
                        console.log
                        Index.Reddit().notif_get(config, service, i);
                        break;
                };
            } else {
                Logger.warn(`Service ID ${service.sid} is not supported! You can request it on https://github.com/WitchOfFrost/codename-updates !`)
            };
        });
        setTimeout(check, 1000 * 60 * 5);
    };
    check();
} main();
