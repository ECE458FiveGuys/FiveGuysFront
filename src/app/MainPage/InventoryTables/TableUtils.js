import ModelFields from "../../../utils/enums";

export default class TableUtils {

    static categoriesToString(categories) {
        let categoryStr = ""
        categories.forEach(category => {
            categoryStr += category[ModelFields.CategoryFields.NAME] + ", "
        })
        return categoryStr === "" ? undefined : categoryStr.slice(0, -2);
    }
}
