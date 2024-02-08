import hot from './hot.js'
import { TodoList, CreateTodo, Header } from './components/index.js'
import { tasks } from './commons/index.js'
import { Toast } from './components/Toast.js'

window._hot = hot
window._state.todos = []
window._state.toastMessage = ""
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

const Sticky = () => hot.div({
    style: {
        position: 'sticky',
        top: 0,
        zIndex: 10000,
        backgroundColor: 'white'
    },
    child: [
        Header,
        CreateTodo,
    ]
})

var app = hot.div({
    className: 'app',
    child: [
        Sticky,
        TodoList,
        Toast
    ]
})

document.body.appendChild(app)
