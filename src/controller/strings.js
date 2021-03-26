export const HOSTS = {
    DEV : "group-six-dev.colab.duke.edu",
    PROD : "group-six-prod.colab.duke.edu",
    LOCAL : "localhost:3000"
}

let ROOT_URL = window.location.host === HOSTS.PROD ? "https://group-six-prod.colab.duke.edu/api/" : "https://group-six-dev.colab.duke.edu/api/"

let ROOT_URL_AUTH = window.location.host === HOSTS.PROD ? "https://group-six-prod.colab.duke.edu/api/auth/" : "https://group-six-dev.colab.duke.edu/api/auth/"

let KLUFE_URL = ROOT_URL + "klufe/"


let OAUTH_URL = `https://oauth.oit.duke.edu/oidc/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code`

export const URLS =
    {
        ROOT : ROOT_URL,
        EXPORT_MODELS : ROOT_URL + "models/export/",
        EXPORT_INSTRUMENTS : ROOT_URL + "instruments/export/",
        EXPORT_ALL : ROOT_URL + "export/",
        IMPORT_MODELS : ROOT_URL + "import-models/",
        IMPORT_INSTRUMENTS : ROOT_URL + "import-instruments/",
        MODELS_ALL : ROOT_URL + "models/all",
        INSTRUMENTS_ALL : ROOT_URL + "instruments/all/",
        ASSET_TAGS_BY_PKS : ROOT_URL + "instruments/asset_tag_numbers/",
        MODELS : ROOT_URL + "models/",
        INSTRUMENTS : ROOT_URL + "instruments/",
        VENDOR : ROOT_URL + "models/vendors/",
        MODEL_CATEGORIES : ROOT_URL + "model-categories/",
        INSTRUMENT_CATEGORIES: ROOT_URL + "instrument-categories/",
        OAUTH_URL : OAUTH_URL,
        MODEL_NUMBERS : ROOT_URL + "models/model_numbers/",
        CALIBRATIONS : ROOT_URL + "calibration-events/"
    }

export const KLUFE_URLS = {
    ON : KLUFE_URL + "on/",
    OFF : KLUFE_URL + "off/",
    SET_AC : KLUFE_URL + "set/AC/",
    SET_DC : KLUFE_URL + "set/DC/"
}


export const AUTH_URLS =
    {
        USERS : ROOT_URL_AUTH + "users/",
        LOGIN : ROOT_URL_AUTH + "token/login",
        GET_OAUTH_CODE : OAUTH_URL,
        GET_OAUTH_TOKEN : ROOT_URL_AUTH + "oauth/login/",
        PASSWORD_CHANGE : ROOT_URL_AUTH + "users/set_password/",
        SELF : ROOT_URL_AUTH + "users/me/"
    }

export const METHODS =
    {
        POST : 'POST',
        GET : 'GET',
        PUT : 'PUT',
        DELETE : "DELETE",
            PATCH : 'PATCH'
    }
