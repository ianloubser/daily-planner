import hot from '../hot.js'
import { auth } from '../commons/index.js'

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
    // var dialog = hot.dialog({
    //     open: true,
    //     child: "Eyyy does this work ?"
    // })
    // document.body.appendChild(dialog)
}

const UserAvatar = () => {
    return hot.div({
        style: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        child: [
            hot.div({
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
            }),
            hot.img({
                className: "avatar-photo",
                referrerPolicy: 'no-referrer',
                src: auth.currentUser().photoURL
            })
        ]
    })
}

const Auth = () => {
    const loggedIn = () => {
        return auth.currentUser() && !auth.currentUser().isAnonymous
    }

    return hot.div({
        id: 'auth-header',
        child: () => loggedIn() ? UserAvatar() : (
            hot.button({
                child: 'login',
                onclick: signIn
            })
        )
    })
}

const Heading = () => {
    return hot.div({
        style: {
            display: 'flex',
            alignItems: 'center'
        },
        child: [
            hot.span({
                style: {
                    padding: 5,
                    cursor: 'pointer'
                },
                onclick: () => document.querySelector("html").classList.toggle("dark-mode"),
                child: '🌗'
            }),
            hot.h2('Day planner'),
        ]
    })
}

export const Header = () => (
    hot.div({
        className: 'app-header',
        child: [
            Heading,
            Auth
        ]
    })
)