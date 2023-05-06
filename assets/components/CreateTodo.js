import hot from '../hot.js'
import { tasks } from '../commons/index.js'

export const CreateTodo = () => {
    const todoAdd = async () => {
        const input = document.getElementById('todo-input')

        tasks.add(`${input.value}`)

        input.value = ''
        hot.flush('todos')
    }

    const onKeyUp = (ev) => {
        if (ev.key === 'Enter') {
            todoAdd()
        }
    }

    return hot.div({
        style: {
            display: 'flex',
            flex: 1
        },
        child: [
            hot.input({
                onkeyup: onKeyUp,
                style: {
                    display: 'flex',
                    flex: 1,
                    fontSize: 22,
                    padding: '10px 15px'
                },
                id: 'todo-input'
            }),
            hot.button({
                onclick: todoAdd,
                child: 'Save'
            })
        ]
    })
}