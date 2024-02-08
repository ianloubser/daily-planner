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
            "timeMin": start.toISOString(),
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

const findOpenSlot = (busyTimes) => {
    const earliestHour = 8;
    const latestHour = 18;
    const minuteWindow = 30;

    const template = new Date()
    template.setHours(earliestHour)
    template.setMinutes(0)
    template.setSeconds(0)
    template.setMilliseconds(0)

    const maxTime = new Date(template)
    maxTime.setHours(latestHour)

    if (busyTimes.length < 1) {
        const end = new Date(template)
        end.setMinutes(end.getMinutes() + minuteWindow)
        return {
            start: template.toISOString(),
            end: end.toISOString(),
        }
    } else {
        let slots = [
            {
                start: new Date(template),
                end: new Date(busyTimes[0].start)
            },
            {
                start: new Date(busyTimes[busyTimes.length-1].end),
                end: maxTime
            }
        ]
        
        for (let i=1; i<busyTimes.length-1; i++) {
            const begin = new Date(busyTimes[i-1].end)
            const end = new Date(busyTimes[i].start)
    
            if ((end - begin)/60000 >= minuteWindow) {
                slots.push({
                    start: begin,
                    end: end
                })
            }
        }

        const bigEnoughSlots = slots.filter(s => (s.end - s.start)/60000 >= minuteWindow)
        if (bigEnoughSlots.length > 0) {
            const closing = new Date(bigEnoughSlots[0].start)
            closing.setMinutes(closing.getMinutes() + minuteWindow)
            return {
                start: bigEnoughSlots[0].start.toISOString(),
                end: closing.toISOString()
            }
        }

        return 0;
    }
}

export {
    checkGoogleAuthToken,
    fetchBusyTimes,
    createEvent,
    findOpenSlot
}