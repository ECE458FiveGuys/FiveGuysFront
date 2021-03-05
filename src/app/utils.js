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

export function getCurrentDate() {
    const d = Date.now();
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    return `${mo}-${da}-${ye}`
}

