import hot from 'hot'
import { tasks } from 'commons'

const overdueHex = (t, maxOverdue = window._state.maxOverdue) => {
    const days = parseInt((new Date() - new Date(t.created)) / (86400 * 1000))
    const factor = days/maxOverdue;
    const clamped = Math.min(Math.max((factor), 0.0), 1.0)

    return (parseInt(clamped*255)).toString(16)
}

export const TodoItem = (t) => {
    const onTodoRemove = () => {
        tasks.remove(t.id)
        hot.flush('todos')
    }

    const toggle = async () => {
        await tasks.update({...t, done: !t.done})
    }

    const daysOld = () => {
        return Math.floor((new Date() - new Date(t.created)) / (86400 * 1000))
    }

    return () => hot.div({
        className: 'todo-row',
        style: () => ({
            backgroundColor: t.done ? undefined : `#ff0000${overdueHex(t)}`
        }),
        child: [
            hot.input({
                type: 'checkbox',
                checked: t.done,
                onclick: toggle
            }),
            hot.span({
                style: {
                    fontSize: 20,
                    marginLeft: 10,
                    flex: 1,
                    cursor: 'pointer',
                    textDecoration: t.done ? 'line-through' : undefined
                },
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
            hot.button({
                onclick: onTodoRemove,
                className: 'todo-delete',
                child: '🗑️'
            })
        ]
    })
}
