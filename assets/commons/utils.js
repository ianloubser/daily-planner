
export const getDateMidnight = (date) => {
    const midnight = date;
    midnight.setHours(0)
    midnight.setMinutes(0)
    midnight.setSeconds(0)
    midnight.setMilliseconds(0)

    return midnight
}