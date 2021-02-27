import RequestUtils from "./request_utils";
import {METHODS, URLS} from "../strings";


export default class ImportExportRequests{

    static async importModels(token, data){
        let header = RequestUtils.buildTokenHeader(token);
        return await RequestUtils.assisted_import_fetch(URLS.IMPORT_MODELS,
            METHODS.POST, header, {}, data)
    }

    static async importInstruments(token, data){
        let header = RequestUtils.buildTokenHeader(token);
        return await RequestUtils.assisted_import_fetch(URLS.IMPORT_INSTRUMENTS,
            METHODS.POST, header, {}, data)
    }

    static async exportModels(token){
        let header = RequestUtils.buildTokenHeader(token)
        return await RequestUtils.assisted_export_fetch(URLS.EXPORT_MODELS,
            METHODS.GET, header)
    }

    static async exportInstruments(token){
        let header = RequestUtils.buildTokenHeader(token)
        return await RequestUtils.assisted_export_fetch(URLS.EXPORT_INSTRUMENTS,
            METHODS.GET, header)
    }

}