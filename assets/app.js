import hot from './hot.js'
import { TodoList, CreateTodo, Header } from './components/index.js'
import { tasks } from './commons/index.js'

window._state.todos = []
window._state.maxOverdue = localStorage.getItem('max_overdue') || 5

tasks.subscribe((tasks) => {
    window._state.todos = tasks
    console.time("Trace")
    hot.flush('todos')
    console.timeEnd("Trace");
})

window.addEventListener('focus', () => {
    // re-render on focus in order to keep the overdue colour calc accurate
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
