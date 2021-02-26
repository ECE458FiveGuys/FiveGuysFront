import ModelFields from "../../../../utils/enums";

export default class TableUtils {

    /*
     for model categories in model objects, each model category in the list of categories will be an object with category pk and category name.

     for model categories in instrument objects, each model category in the list of categories is just an id referencing the category
     */
    static categoriesToString(categories) {
        let categoryStr = ""
        categories.forEach(category => {
            categoryStr += category[ModelFields.CategoryFields.NAME] + ", "
        })
        return categoryStr === "" ? undefined : categoryStr.slice(0, -2);
    }
}
