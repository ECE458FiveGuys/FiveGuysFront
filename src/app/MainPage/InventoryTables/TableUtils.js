
export default class TableUtils {

    static categoriesToString(categories) {
        return categories.sort().join(", ")
    }
}
