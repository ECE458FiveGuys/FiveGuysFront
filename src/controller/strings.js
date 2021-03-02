import {UserError} from "./exceptions";

let ROOT_URL =
    (window.location.host === "group-six-react.colab.duke.edu" || window.location.host === "localhost:3000") ?
        "http://group-six-test.colab.duke.edu/api/" : window.location.host === "group-six-react-prod.colab.duke.edu" ?
        "https://group-six-prod.colab.duke.edu/api/" : undefined

let ROOT_URL_AUTH =
    (window.location.host === "group-six-react.colab.duke.edu" || window.location.host === "localhost:3000") ?
        "http://group-six-test.colab.duke.edu/" : window.location.host === "group-six-react-prod.colab.duke.edu" ?
        "https://group-six-prod.colab.duke.edu/" : undefined


let OAUTH_URL = `https://oauth.oit.duke.edu/oidc/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code`

export const URLS =
    {
        ROOT : ROOT_URL,
        USERS : ROOT_URL_AUTH + "auth/users/",
        LOGIN : ROOT_URL_AUTH + "auth/token/login",
        EXPORT_MODELS : ROOT_URL + "export-models/",
        EXPORT_INSTRUMENTS : ROOT_URL + "export-instruments/",
        EXPORT_ALL : ROOT_URL + "export/",
        IMPORT_MODELS : ROOT_URL + "import-models/",
        IMPORT_INSTRUMENTS : ROOT_URL + "import-instruments/",
        MODELS_ALL : ROOT_URL + "models/all",
        INSTRUMENTS_ALL : ROOT_URL + "instruments/all",
        MODELS : ROOT_URL + "models/",
        INSTRUMENTS : ROOT_URL + "instruments/",
        VENDORS : ROOT_URL + "models/vendors/",
        MODEL_CATEGORIES : ROOT_URL + "model-categories/",
        INSTRUMENT_CATEGORIES: ROOT_URL + "instrument-categories/",
        OAUTH_URL : OAUTH_URL
    }

export const OAUTH_URLS =
    {
            GET_CODE : OAUTH_URL,
            GET_TOKEN : ROOT_URL_AUTH + "auth/oauth/"
    }



export const METHODS =
    {
        POST : 'POST',
        GET : 'GET',
        PUT : 'PUT',
        DELETE : "DELETE"
    }