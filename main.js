const root = document.getElementById('root')

const llamadoAlert = (titleAlert, dataAlert, tm, classL) => {
    if (document.querySelector('.appendAlert')) {
        document.querySelector('.appendAlert').remove()
    }

    const mensajeAlert = document.createElement('div')
    mensajeAlert.className = "appendAlert"

    mensajeAlert.innerHTML = `
        <h4 class="${classL}">${titleAlert}</h4>
        <p>${dataAlert}</p>
    `
    document.body.appendChild(mensajeAlert)

    setTimeout(() => {
        mensajeAlert.remove()
        if (classL !== "none") window.location.href = 'index.html'
    }, tm)
}

const userLocalStoreData = (rowDate) => {
    const title = document.createElement("h2")
    title.innerHTML = "Lista de Usuarios Registrados"

    const textContainer = document.createElement("div")
    textContainer.className = "textContainer"

    textContainer.appendChild(title)

    users.forEach((user) => {
        const userDiv = document.createElement("div")
        userDiv.className = "divContainerUser"
        userDiv.innerHTML = `
            <p>Gmail: ${user.email} </p>
            <p>Nombre: ${user.username} </p>
        `
        textContainer.appendChild(userDiv)
    })

    rowDate.appendChild(textContainer)

    return textContainer
}

const appenButton = () => {
    const rowDate = document.createElement("div");
    rowDate.className = "buttonContain"
    rowDate.id = "buttonContain"
    rowDate.style.position = "relative"

    const button = document.createElement("button")
    button.id = "botonCorredizo"

    const openSVG = `
        <svg class="openButton" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
            <path fill="currentColor" d="m12.404 8.303l3.431 3.327c.22.213.22.527 0 .74l-6.63 6.43C8.79 19.201 8 18.958 8 18.43v-5.723z"/>
            <path fill="currentColor" d="M8 11.293V5.57c0-.528.79-.771 1.205-.37l2.481 2.406z" opacity="0.5"/>
        </svg>
    `;

    const closeSVG = `
        <svg class="closeButton" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M11.596 8.303L8.165 11.63a.5.5 0 0 0 0 .74l6.63 6.43c.414.401 1.205.158 1.205-.37v-5.723z"/>
            <path fill="currentColor" d="M16 11.293V5.57c0-.528-.791-.771-1.205-.37l-2.482 2.406z" opacity="0.5"/>
        </svg>
    `;

    button.innerHTML = openSVG
    rowDate.appendChild(button)

    const textContainer = userLocalStoreData(rowDate)
    rowDate.appendChild(textContainer)
    root.appendChild(rowDate)

    let isTextVisible = false

    button.addEventListener("click", () => {
        if (!isTextVisible) {
            textContainer.className = "textVisible"
            button.style.transform = "translateX(3px)"
            button.innerHTML = closeSVG
            document.body.classList.add("dark")
        } else {
            textContainer.className = "textContainer"
            button.style.transform = "translateX(0px)"
            button.innerHTML = openSVG
            document.body.classList.remove("dark")
        }
        isTextVisible = !isTextVisible
    });

};




const removeDuplicates = (users) => {
    const uniqueUsers = []
    const seenEmails = new Set()
    const seenUsernames = new Set()

    users.forEach(user => {
        if (!seenEmails.has(user.email) && !seenUsernames.has(user.username)) {
            uniqueUsers.push(user)
            seenEmails.add(user.email)
            seenUsernames.add(user.username)
        }
    })

    return uniqueUsers
}

let users = JSON.parse(localStorage.getItem('users')) || []
if (!Array.isArray(users)) {
    users = []
}

const loadUsersFromAPI = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    const json = await res.json()

    const apiUsers = json.map(user => ({
        username: user.username,
        email: user.email,
        userPassword: user.username,
        balance: 0
    }))

    users = removeDuplicates(users.concat(apiUsers))
    localStorage.setItem('users', JSON.stringify(users))

    return users
}

const validAccess = () => {



    const userLoged = JSON.parse(localStorage.getItem('loggedInUser'))
    root.innerHTML = `
        <section id="account-section" class="section-userlog">
            <div class="divTitle">
                <h2>Bienvenido ${userLoged.username}</h2>
                <p>Saldo disponible: ${userLoged.balance?.toFixed(2) || 0.00}</p>
            </div>
            <div class="divButtons">
                <button id="deposit-button">Depositar</button>
                <button id="transfer-button">Transferir</button>
                <button id="logout-button">Cerrar Sesión</button>
            </div>
        </section>
    `

    document.getElementById('logout-button').addEventListener('click', () => {
        llamadoAlert(userLoged.username, "Hasta la próxima", 3000, "close")
        localStorage.removeItem('loggedInUser')
    })

    document.getElementById('deposit-button').addEventListener('click', () => {
        root.innerHTML = `
            <div id="deposit-modal"> 
                <h2>Realizar Depósito</h2>
                <form id="deposit-form">
                    <label for="deposit-amount">Monto a depositar:</label>
                    <input type="number" id="deposit-amount" min="0.01" step="0.01" required>
                    <button type="submit">Depositar</button>
                </form> 
            </div>    
        `

        document.getElementById('deposit-form').addEventListener('submit', (e) => {
            e.preventDefault()
            const amount = parseFloat(document.getElementById('deposit-amount').value)

            if (!isNaN(amount) && amount > 0) {
                userLoged.balance += amount
                localStorage.setItem('loggedInUser', JSON.stringify(userLoged))

                const userIndex = users.findIndex(u => u.email === userLoged.email)
                if (userIndex !== -1) {
                    users[userIndex] = userLoged
                    localStorage.setItem('users', JSON.stringify(users))
                }
                llamadoAlert("Depósito realizado", `Se depositó: $${amount}`, 3000, "success")
            }
        })
    })

    document.getElementById('transfer-button').addEventListener('click', () => {
        root.innerHTML = `
            <div id="transfer-modal"> 
                <h2>Realizar Transferencia</h2>
                <form id="transfer-form">
                    <label for="recipient-email">Gmail del Destinatario:</label>
                    <input type="text" id="recipient-email" required>
                    <label for="transfer-amount">Monto a transferir:</label>
                    <input type="number" id="transfer-amount" min="0.01" step="0.01" required>
                    <button type="submit">Transferir</button>
                </form> 
            </div>    
        `

        document.getElementById('transfer-form').addEventListener('submit', (e) => {
            e.preventDefault()
            const recipientEmail = document.getElementById('recipient-email').value
            const amount = parseFloat(document.getElementById('transfer-amount').value)
            const recipient = users.find(u => u.email === recipientEmail)

            if (recipient && !isNaN(amount) && amount > 0 && userLoged.balance >= amount) {
                userLoged.balance -= amount
                recipient.balance += amount

                localStorage.setItem('loggedInUser', JSON.stringify(userLoged))

                const userIndex = users.findIndex(u => u.email === userLoged.email)
                const recipientIndex = users.findIndex(u => u.email === recipient.email)

                if (userIndex !== -1) users[userIndex] = userLoged
                if (recipientIndex !== -1) users[recipientIndex] = recipient

                localStorage.setItem('users', JSON.stringify(users))

                llamadoAlert("Transferencia realizada con éxito", `Se transfirió: $${amount} al usuario con el Gmail: ${recipientEmail}`, 3000, "success")
            } else {
                llamadoAlert("Lo sentimos", `Transferencia inválida o saldo insuficiente`, 3000, "error")
            }
        })
    })
}

const showLogin = () => {
    root.innerHTML = `
        <section id="seccion-ingreso">
            <h2>Iniciar Sesión</h2>
            <form id="formulario-ingreso">
                <label for="ingreso-email">Gmail:</label>
                <input type="email" id="ingreso-email" required>
                <label for="login-password">Nombre:</label>
                <input type="password" id="login-password" required>
                <button type="submit">Iniciar Sesión</button>
            </form>
            <p>¿No tienes una cuenta? <a href="#" id="register-link">Regístrate aquí</a></p>
        </section>
    `

    document.getElementById('formulario-ingreso').addEventListener('submit', (e) => {
        e.preventDefault()
        const userEmail = document.getElementById('ingreso-email').value
        const password = document.getElementById('login-password').value

        const user = users.find(u => u.email === userEmail && u.userPassword === password)

        if (user) {
            localStorage.setItem('loggedInUser', JSON.stringify(user))
            validAccess()
            setTimeout(() => window.location.href = 'index.html', 1)
        } else {
            llamadoAlert("Error", "El Usuario o Contraseña son Incorrectos", 3000, "error")
        }
    })

    document.getElementById('register-link').addEventListener('click', (e) => {
        root.innerHTML = `
        <section id="register-section">
            <h2>Crea Tu Nueva Cuenta</h2>
            <form id="register-form">
                <label for="register-username">Usuario:</label>
                <input type="text" id="register-username" required>
                <label for="register-email">Gmail:</label>
                <input type="email" id="register-email" required>
                <label for="register-password">Contraseña:</label>
                <input type="password" id="register-password" required>
                <button type="submit">Registrarse</button>
            </form>
        </section>
        `

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault()
            const username = document.getElementById('register-username').value
            const userEmail = document.getElementById('register-email').value
            const password = document.getElementById('register-password').value

            const userExists = users.some(u => u.email === userEmail || u.username === username)

            if (userExists) {
                llamadoAlert("Error", "El Gmail o el nombre de usuario ya están registrados", 3000, "error")
                return
            }

            const newUser = {
                username,
                email: userEmail,
                userPassword: password,
                balance: 0
            }

            users.push(newUser)
            localStorage.setItem('users', JSON.stringify(users))

            llamadoAlert("Registro Exitoso", "Tu cuenta ha sido creada", 3000, "success")
        })
    })
}

const initApp = async () => {

    await loadUsersFromAPI()

    const userLoged = JSON.parse(localStorage.getItem('loggedInUser'))
    if (userLoged) {
        validAccess()
    } else {
        showLogin()
        appenButton()
    }
}

initApp()


