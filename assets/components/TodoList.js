import hot from 'hot'
import { TodoItem, OverdueControl } from 'components'
import { getDateMidnight } from 'commons'

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
        const midnight = getDateMidnight(new Date())
        const today = [...window._state.todos]
            .filter(t => (t.done && t.completed > midnight) || !t.done)
            .sort((a, b) => a.done ? 1 : b.done ? -1 : 0)
        
        const oneDayAgo = new Date(midnight.getTime());
        oneDayAgo.setDate(midnight.getDate()-1)
        const yesterday = [...window._state.todos]
            .filter(t => t.completed >= oneDayAgo && t.completed < midnight && t.done)

        const older = [...window._state.todos]
            .filter(t => (t.completed === undefined || t.completed < oneDayAgo) && t.done)
            .sort((a, b) => b.completed - a.completed)

        return [today, yesterday, older]
    }

    return hot.div({
        id: 'todos',
        child: () => {
            const groups = grouped()

            return [
                TodayGroup,
                ListOrEmpty(groups[0]),
                hot.h4('Yesterday'),
                ListOrEmpty(groups[1]),
                hot.h4('Older'),
                ListOrEmpty(groups[2])
            ]
        }
    })
}