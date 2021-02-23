import RequestUtils from "./request_utils";
import {METHODS, URLS} from "../../strings";
import ModelFields from "../../utils/enums";
import {UserError} from "../exceptions";


export default class ImportExportRequests{

    static async importModels(token, file){
        let header = RequestUtils.build_token_header(token)
        let files = RequestUtils.build_files_obj(file)
        let import_data = await RequestUtils.assisted_fetch(URLS.IMPORT_MODELS,
            METHODS.POST, header, files)

        return import_data
    }

    static async importInstruments(token, file){
        let header = RequestUtils.build_token_header(token)
        let files = RequestUtils.build_files_obj(file)
        let import_data = await RequestUtils.assisted_fetch(URLS.IMPORT_INSTRUMENTS,
            METHODS.POST, header, files)

        return import_data
    }

    static async exportModels(token){
        let header = RequestUtils.build_token_header(token)
        let export_data = await  RequestUtils.assisted_export_fetch(URLS.EXPORT_MODELS,
            METHODS.GET,header)

        return export_data
    }

    static async exportInstruments(token){
        let header = RequestUtils.build_token_header(token)
        let export_data = await  RequestUtils.assisted_export_fetch(URLS.EXPORT_INSTRUMENTS,
            METHODS.GET,header)

        return export_data
    }

    static async exportAll(token){
        let header = RequestUtils.build_token_header(token)
        let export_data = await  RequestUtils.assisted_fetch(URLS.EXPORT_ALL,
            METHODS.GET,header)

        return export_data
    }
}