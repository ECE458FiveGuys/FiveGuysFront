import ModelFields from "../../../../utils/enums";

export default class ErrorParser {

    /*
     for model categories in model objects, each model category in the list of categories will be an object with category pk and category name.

     for model categories in instrument objects, each model category in the list of categories is just an id referencing the category
     */
    static parse(json) {
        let resultingString = ''
        let on = false
        for (let i=1; i<json.length-1; i++){
            if (json.substring(i, i+1)=='"'){
                on = !on;
            }
            else if (json.substring(i, i+1)==','){
                resultingString = resultingString + '\n'
            }
            else if (json.substring(i, i+1)=='[' || json.substring(i, i+1)==']'){
                resultingString = resultingString + ' '
            }
            else {
                resultingString = resultingString + json.substring(i, i+1)
            }
        }
        return resultingString
    }

    static parseCategories(json){
        let resultingArray = []

        let indexOfName = 0
        let indexOfEnd = 0
        for (let i=0; i<10; i++){
            while (json.indexOf("name")!=-1){
                indexOfName = json.indexOf('"name"')
                json = json.substring(indexOfName+6)
                indexOfEnd = json.indexOf("}")
                resultingArray.push(json.substring(2,indexOfEnd-1))
                json = json.substring(indexOfEnd)
            }
        }
        return resultingArray
    }
}