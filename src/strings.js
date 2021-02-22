let ROOT_URL = "http://group-six-test.colab.duke.edu/"


export const URLS =
    {
        ROOT : ROOT_URL,
        LOGIN : ROOT_URL + "auth/token/login",
        MODELS : ROOT_URL + "/models/",
        INSTRUMENTS : ROOT_URL + "/instruments/",
        EXPORT_MODELS : ROOT_URL + "/export-models/",
        EXPORT_INSTRUMENTS : ROOT_URL + "/export-instruments/",
        EXPORT_ALL : ROOT_URL + "/export/",
        IMPORT_MODELS : ROOT_URL + "/import-models/",
        IMPORT_INSTRUMENTS : ROOT_URL + "/import-instruments/",
    }

export const METHODS =
    {
        POST : 'POST',
        GET : 'GET'
    }