import hot from '../hot.js'

export const OverdueControl = () => {
    let focussed = false;
    const setNewOverdue = () => {
        if (!focussed) return;

        focussed = false;
        const value = document.getElementById('overdue-input').value
        window._state.maxOverdue = parseInt(value)
        localStorage.setItem('max_overdue', parseInt(value))
        hot.flush('todos')
    }

    const onKeyUp = (ev) => {
        if (ev.key === 'Enter') {
            setNewOverdue()
        }
    }
    
    return hot.div({
        style: {
            display: 'flex',
            alignItems: 'center'
        },
        child: [
            hot.span('Max days overdue: '),
            hot.input({
                onkeyup: onKeyUp,
                onblur: setNewOverdue,
                onfocus: () => focussed = true,
                style: {
                    marginLeft: 5,
                    fontSize: 14,
                    width: 80,
                    padding: '3px 7px'
                },
                value: window._state.maxOverdue,
                id: 'overdue-input'
            })
        ]
    })
}