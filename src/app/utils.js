import moment from 'moment'

export const dateColors = {
    RED : "red",
    ORANGE : "orange",
    GREEN : "green"
}

export const dateIcons = {
    [dateColors.RED] : "exclamation-triangle",
    [dateColors.ORANGE] : "exclamation-circle",
    [dateColors.GREEN] : "calendar-check"
}

export function parseDate(expirationDateString) {
    if (expirationDateString == undefined) {
        return undefined
    }
    let expirationDate = moment(expirationDateString, "YYYY-MM-DD")
    let diff = expirationDate.diff(moment.now(), 'days')
    if (diff < 0) {
        return dateColors.RED
    } else if (diff < 30) {
        return dateColors.ORANGE
    } else {
        return dateColors.GREEN
    }
}

export function getCurrentDate() {
    const d = Date.now();
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    return `${ye}-${mo}-${da}`
}

export let handleNavClick = (url, history, newTab = undefined) => {
    if (!window.event && newTab) {
        window.open()
    } else if (window.event && window.event.ctrlKey) {
        window.open(url)
    } else {
        history.push(url)
    }
}

export function arraysEqual (a, b) {
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}