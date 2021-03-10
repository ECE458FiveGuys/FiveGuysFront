import RequestUtils from "./request_utils";
import {METHODS, URLS} from "../strings";
import ModelFields from "../../utils/enums";


export default class ImportExportRequests{

    static async import(token, file, type,
                        callBack = (json) => json,
                        errorMessageCallBack = (errorMessage) => errorMessage,){
        let header = RequestUtils.buildTokenHeader(token);
        const data = new FormData();
        data.append('file', file);
        RequestUtils.assistedFetch(type == ModelFields.ModelTypes.INSTRUMENT ?
            URLS.IMPORT_INSTRUMENTS : URLS.IMPORT_MODELS,
            METHODS.POST,  callBack, errorMessageCallBack, header, undefined, data)
    }
}