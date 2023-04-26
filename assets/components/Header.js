import hot from 'hot'
import { auth } from 'commons'

auth.subscribe(() => {
    hot.flush('auth-header')
})

const signIn = async () => {
    try {
        await auth.signIn()
    } catch (error) {
        console.log("Error", error)
        alert(error.message)
    }
}

const Auth = () => {
    const loggedIn = () => {
        return auth.currentUser() && !auth.currentUser().isAnonymous
    }

    return hot.div({
        id: 'auth-header',
        child: () => loggedIn() ? hot.div({
            style: {
                display: 'flex',
                flexDirection: 'column'
            },
            child: [
                hot.span(`${auth.currentUser().email}`),
                hot.button({
                    child: 'logout',
                    onclick: () => auth.signOut()
                })
            ]
        }) : (
            hot.button({
                child: 'login',
                onclick: signIn
            })
        )
    })
}

export const Header = () => (
    hot.div({
        style: {
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0'
        },
        child: [
            hot.h2('Day planner'),
            Auth
        ]
    })
)