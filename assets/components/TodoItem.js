import hot from '../hot.js'
import { checkGoogleAuthToken, fetchBusyTimes, createEvent, findOpenSlot } from '../commons/calendar.js'
import { tasks, getDateMidnight } from '../commons/index.js'
import { showToast } from '../commons/utils.js'

const overdueHex = (t, maxOverdue = window._state.maxOverdue) => {
    const days = parseInt((new Date() - new Date(t.created)) / (86400 * 1000))
    const factor = days/maxOverdue;
    const clamped = Math.min(Math.max((factor), 0.0), 1.0)

    return (parseInt(clamped*255)).toString(16)
}

const syncTodoToCalendar = async (todo) => {
    showToast("Checking Google Calendar.")
    const token = await checkGoogleAuthToken()
    const busy = await fetchBusyTimes(token, new Date())
    const openSlot = findOpenSlot(busy.calendars.primary.busy)
    if (!openSlot) {
        showToast("No open time today :(")
        showToast("", 4000)
        return

    }
    showToast("Creating event.")
    await createEvent(token, openSlot, todo.text)
    
    showToast("30min focus time booked!")
    showToast("", 4000)
}

export const TodoItem = (t) => {
    const onTodoRemove = () => {
        tasks.remove(t.id)
        hot.flush('todos')
    }

    const onTodoSync = async () => {
        syncTodoToCalendar(t)
    }

    const toggle = async () => {
        await tasks.update({...t, done: !t.done, completed: new Date().getTime()})
    }

    const daysOld = () => {
        const currentDate = t.done ? new Date(t.completed) : new Date();
        return Math.floor((getDateMidnight(currentDate) - getDateMidnight(new Date(t.created))) / (86400 * 1000))
    }

    return () => hot.div({
        className: 'todo-row',
        style: {
            backgroundColor: t.done ? undefined : `#ff0000${overdueHex(t)}`
        },
        child: [
            hot.input({
                type: 'checkbox',
                checked: t.done,
                onclick: toggle
            }),
            hot.span({
                style: `
                    font-size: 20px;
                    margin-left: 50px;
                    flex: 1;
                    cursor: pointer;
                    text-decoration: ${t.done ? 'line-through' : undefined};
                `,
                child: t.text,
                onclick: toggle
            }),
            hot.span({
                style: {
                    color: 'black',
                    fontStyle: 'italic'
                },
                child: daysOld() > 0 ? `${daysOld()}d` : ''
            }),
            hot.div({
                style: {
                    marginLeft: 10
                },
                child: [
                    hot.button({
                        onclick: onTodoRemove,
                        className: 'todo-action todo-delete',
                        child: '🗑️',
                        title: "Delete"
                    }),
                    hot.button({
                        onclick: onTodoSync,
                        className: 'todo-action todo-sync',
                        child: '🗓️',
                        title: "Slot some time in your calendar"
                    })
                ]
            })
        ]
    })
}
