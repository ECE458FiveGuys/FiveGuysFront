import RequestUtils from "./request_utils";
import {METHODS, URLS} from "../strings";
import {User} from "../../utils/dtos";

export default class UserRequests {
    static async retrieve_user(token, username)
    {

        let params = {"username" : username}
        let header = RequestUtils.build_token_header(token)

        let users = await RequestUtils.assisted_fetch(URLS.USERS,
            METHODS.GET,
            header,
            params)
        return User.fromJson(users["results"][0])
    }
}