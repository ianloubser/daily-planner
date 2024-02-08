import hot from '../hot.js'

export const Toast = () => (
    hot.div({
        id: 'toast',
        className: () => !window._state.toastMessage ? '' : 'visible',
        child: () => `${window._state.toastMessage}`
    })
)