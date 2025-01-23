import config from "../config/config";
import it from "./locales/it.json";

const translations = {
    it
}

export const t = (key) => {
    const keys = key.split(".");
    let value = translations[config.language];

    keys.forEach((k) => {
        value = value[k];
    });
    return value || key;
}