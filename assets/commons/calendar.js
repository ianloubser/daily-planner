import { auth } from "./auth.js"
import { getCookie, setCookie } from './cookies.js'


const checkGoogleAuthToken = async () => {
    const authToken = getCookie("gauth-token")
    if (!authToken) {
        const tokenResponse = await auth.getGoogleApiToken()

        const tk = tokenResponse.oauthAccessToken
        const expiry = tokenResponse.oauthExpireIn
        setCookie('gauth-token', tk, expiry)

        return tk
    }

    return authToken;
}

const fetchBusyTimes = async (token, dayDate) => {
    const start = new Date(dayDate)
    start.setHours(0)
    start.setMinutes(0)
    start.setSeconds(0)
    start.setMilliseconds(0)

    const end = new Date(start)
    end.setHours(23)
    end.setMinutes(59)
    end.setSeconds(59)

    const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
            "timeMin": dayDate.toISOString(),
            "timeMax": end.toISOString(),
            "items": [
                {
                    "id": "primary"
                }
            ]
        })
    })

    return res.json()
}

const createEvent = async (token, time, text) => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            "summary": text,
            "start": {
                "dateTime": time.start,
                "timeZone": tz
            },
            "end": {
                "dateTime": time.end,
                "timeZone": tz
            }
        })
    })

    return res
}

function dateRangeOverlaps(a_start, a_end, b_start, b_end) {
    if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
    if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
    if (b_start < a_start && a_end < b_end) return true; // a in b
    return false;
}

const findOpenSlot = (busyTimes) => {
    // earliest time the meeting can be
    const earliestHour = 11;
    // latest ending/closing
    const latestHour = 18;

    // how long the slot should be
    const minuteWindow = 30;

    // increments between slots
    const scanIntervalMinutes = 5;

    const template = new Date()
    template.setHours(earliestHour)
    template.setMinutes(0)
    template.setSeconds(0)
    template.setMilliseconds(0)

    const maxTime = new Date(template)
    maxTime.setHours(latestHour)

    let start = new Date(template);
    const now = new Date()
    if (start < now) {
        start.setHours(now.getHours())
        start.setMinutes(Math.ceil(now.getMinutes() / scanIntervalMinutes) * scanIntervalMinutes)
    }

    let finish = new Date(start)
    finish.setMinutes(finish.getMinutes() + minuteWindow)

    const slots = []
    do {
        slots.push({
            start: new Date(start),
            end: new Date(finish)
        })

        start.setMinutes(start.getMinutes() + scanIntervalMinutes)
        finish.setMinutes(finish.getMinutes() + scanIntervalMinutes)

        if (finish > maxTime) {
            start = null;
            finish = null;
        }
    } while (start != null && finish != null);

    let validSlots = []
    if (busyTimes.length > 0) {
        for (let s of slots) {
            let valid = true;
            for (let b of busyTimes) {
                const hasOverlap = dateRangeOverlaps(s.start, s.end, new Date(b.start), new Date(b.end))
                valid = valid && !hasOverlap
            }

            if (valid) {
                validSlots.push(s)
            }
        }
    } else {
        validSlots = slots
    }

    return validSlots
}

export {
    checkGoogleAuthToken,
    fetchBusyTimes,
    createEvent,
    findOpenSlot
}