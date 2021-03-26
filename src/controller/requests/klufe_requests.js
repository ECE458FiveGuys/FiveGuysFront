import RequestUtils from "./request_utils";
import {KLUFE_URLS, METHODS} from "../strings";

class KlufeRequests {

    on() {
        RequestUtils.performFetch(KLUFE_URLS.ON, METHODS.POST, () => {}, (error) => alert(error))
    }

    off() {
        RequestUtils.performFetch(KLUFE_URLS.OFF, METHODS.POST, () => {}, (error) => alert(error))
    }

    setDC() {
        RequestUtils.performFetch(KLUFE_URLS.SET_DC, METHODS.POST, () => {}, (error) => alert(error), )
    }
}