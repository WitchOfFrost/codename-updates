import Logger from "./workers/logger.js";
import ReadFile from "./workers/loadfile.js";
import Index from "./services/routes.js";

let config;

async function main() {
    config = await JSON.parse(ReadFile.cfg());

    config.services.forEach(function (service, i) {
        if (config.supported_services.includes(service.sid)) {
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
};
main();