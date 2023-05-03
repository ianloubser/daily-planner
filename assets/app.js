import hot from 'hot'
import { TodoList, CreateTodo, Header } from 'components'
import { tasks } from 'commons'

window._state.todos = []
window._state.maxOverdue = localStorage.getItem('max_overdue') || 5

tasks.subscribe((tasks) => {
    window._state.todos = tasks
    hot.flush('todos')
})

var app = hot.div({
    className: 'app',
    child: [
        Header,
        CreateTodo,
        TodoList
    ]
})

document.body.appendChild(app)
