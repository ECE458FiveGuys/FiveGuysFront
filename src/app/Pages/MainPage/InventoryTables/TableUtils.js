import ModelFields from "../../../../utils/enums";

export default class TableUtils {

    /*
     for model categories in model objects, each model category in the list of categories will be an object with category pk and category name.

     for model categories in instrument objects, each model category in the list of categories is just an id referencing the category
     */
    static categoriesToString(categories, modelCategoriesIDtoName = new Map()) {
        let categoryStr = ""
        categories.forEach(category => {
            if (typeof category === 'object') {
                categoryStr += category[ModelFields.CategoryFields.NAME] + ", "
            } else if (Number.isInteger(category)) {
                let categoryId = category
                categoryStr+= modelCategoriesIDtoName.get(categoryId) + ", "
            }
        })
        return categoryStr === "" ? undefined : categoryStr.slice(0, -2);
    }
}
