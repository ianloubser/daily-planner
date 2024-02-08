import hot from '../hot.js'

export const getDateMidnight = (date) => {
    const midnight = date;
    midnight.setHours(0)
    midnight.setMinutes(0)
    midnight.setSeconds(0)
    midnight.setMilliseconds(0)

    return midnight
}

export const showToast = (message, timeout = 0) => {
    setTimeout(() => {
        window._state.toastMessage = message
        hot.flush('toast')
    }, timeout)
}