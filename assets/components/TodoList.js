import hot from 'hot'
import { TodoItem } from 'components'

const ListOrEmpty = (items) => (
    !items || !items.length ? (
        hot.i({
            style: {
                color: 'gray'
            },
            child: 'No items to show'
        })
    ) : (
        [...items.map(TodoItem)]
    )
)

export const TodoList = () => {
    const grouped = () => {
        const midnight = new Date()
        midnight.setHours(0)
        midnight.setMinutes(0)
        midnight.setSeconds(0)
        midnight.setMilliseconds(0)
        const today = window._state.todos
            .filter(t => t.created >= midnight || !t.done)
        const yesterday = window._state.todos
            .filter(t => t.created < midnight && t.done)

        return [today, yesterday]
    }

    return hot.div({
        id: 'todos',
        child: () => {
            const groups = grouped()

            return [
                hot.h4('Today'),
                ListOrEmpty(groups[0]),
                hot.h4('Yesterday'),
                ListOrEmpty(groups[1])
            ]
        }
    })
}