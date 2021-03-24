import ModelFields from "./enums";

export class User {
    constructor(id, username, name, email, isActive, isStaff, groups) {
        this.id = id
        this.username = username
        this.name = name
        this.email = email
        this.is_active = isActive
        this.is_staff = isStaff
        this.groups = groups
    }

    static fromJson(obj) {
        return new User(obj[ModelFields.UserFields.ID],
                        obj[ModelFields.UserFields.USERNAME],
                        obj[ModelFields.UserFields.NAME],
                        obj[ModelFields.UserFields.EMAIL],
                        obj[ModelFields.UserFields.ACTIVITY],
                        obj[ModelFields.UserFields.IS_STAFF],
                        obj[ModelFields.UserFields.GROUPS])
    }

    isNetIdUser() {
        return this.username.endsWith("@duke.edu")
    }

    getFirstName() {
        return this.name.split(" ")[0]
    }

}