import moment from 'moment'

export const dateColors = {
    RED : "red",
    YELLOW : "yellow",
    GREEN : "green"
}

export function parseDate(expirationDateString) {
    if (expirationDateString == undefined) {
        return this.createCalibrationExpirationElement("Noncalibratable", "black")
    }
    let expirationDate = moment(expirationDateString, "YYYY-MM-DD")
    let diff = expirationDate.diff(moment.now(), 'days')
    if (diff < 0) {
        return dateColors.RED
    } else if (diff < 30) {
        return dateColors.YELLOW
    } else {
        return dateColors.GREEN
    }
}

//console.log(parseDate("2021-12-23"))

