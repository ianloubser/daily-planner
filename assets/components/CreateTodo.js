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
        className: 'create-todo',
        child: [
            hot.input({
                onkeyup: onKeyUp,
                id: 'todo-input',
                placeholder: 'What do you need to do ?'
            }),
            hot.div({
                style: {
                    display: 'flex',
                    alignItems: 'center'
                },
                child: [
                    hot.button({
                        onclick: todoAdd,
                        child: 'Save'
                    })
                ]
            })
        ]
    })
}