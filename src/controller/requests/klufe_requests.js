import RequestUtils from "./request_utils";
import {KLUFE_URLS, METHODS} from "../strings";

export default class KlufeRequests {

    static on(token) {
        let header = RequestUtils.buildTokenHeader(token)
        RequestUtils.assistedFetch(KLUFE_URLS.ON, METHODS.POST, () => {}, (error) => alert(error), header)
    }

    static off(token) {
        let header = RequestUtils.buildTokenHeader(token)
        RequestUtils.assistedFetch(KLUFE_URLS.OFF, METHODS.POST, () => {}, (error) => alert(error), header)
    }

    static setDC(token, volts) {
        let header = RequestUtils.buildTokenHeader(token)
        let data = new FormData()
        data.append("volts", volts)
        RequestUtils.assistedFetch(KLUFE_URLS.SET_DC, METHODS.POST, () => {}, (error) => alert(error), header, undefined, data)
    }

    static setAC(token, volts, frequency) {
        let header = RequestUtils.buildTokenHeader(token)
        let data = new FormData()
        data.append("volts", volts)
        data.append("frequency", frequency)
        RequestUtils.assistedFetch(KLUFE_URLS.SET_AC, METHODS.POST, () => {}, (error) => alert(error), header, undefined, data)
    }
}