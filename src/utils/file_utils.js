
export default class FileUtils {

    static getFileNameFromPath(filepath) {
        return filepath.replace(/^.*[\\\/]/, '')
    }

}