import hot from 'hot'
import { tasks } from 'commons'

export const TodoItem = (t) => {
    const onTodoRemove = () => {
        tasks.remove(t.id)
        hot.flush('todos')
    }

    const toggle = async () => {
        await tasks.update({...t, done: !t.done})
    }

    const daysOld = () => {
        return (new Date().getDate()) - new Date(t.created).getDate()
    }

    return () => hot.div({
        className: 'todo-row',
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
                    color: 'gray',
                    fontStyle: 'italic'
                },
                child: daysOld() > 0 ? `${daysOld()}d` : ''
            }),
            hot.button({
                onclick: onTodoRemove,
                style: {
                    marginLeft: 20,
                    cursor: 'pointer'
                },
                child: 'x'
            })
        ]
    })
}
