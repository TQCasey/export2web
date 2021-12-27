
export default class AppConfig {

    static instance = null;

    constructor () {
        // this.url_pre = "http://localhost:8000";   
        this.url_pre = "";   
    }

    static getInstance () {
        if (!AppConfig.instance) {
            AppConfig.instance = new AppConfig ();
        }

        return AppConfig.instance;
    }

    parseUrl (url) {
        return this.url_pre + url;
    }

}



