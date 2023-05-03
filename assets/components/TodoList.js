import hot from 'hot'
import { TodoItem, OverdueControl } from 'components'

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

const TodayGroup = () => (
    hot.div({
        style: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        child: [
            hot.h4('Today'),
            OverdueControl
        ]
    })
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
                TodayGroup,
                ListOrEmpty(groups[0]),
                hot.h4('Yesterday'),
                ListOrEmpty(groups[1])
            ]
        }
    })
}