let ROOT_URL = "http://group-six-test.colab.duke.edu/"


export const URLS =
    {
        ROOT : ROOT_URL,
        LOGIN : ROOT_URL + "auth/token/login",
        MODELS : ROOT_URL + "models/",
        INSTRUMENTS : ROOT_URL + "instruments/",
        VENDORS : ROOT_URL + "models/vendors/",
        USERS : ROOT_URL + "auth/users/",
        MODEL_CATEGORIES : ROOT_URL + "model-categories/",
        INSTRUMENT_CATEGORIES: ROOT_URL + "instrument-categories/"
    }

export const METHODS =
    {
        POST : 'POST',
        GET : 'GET',
        PUT : 'PUT',
        DELETE : "DELETE"
    }