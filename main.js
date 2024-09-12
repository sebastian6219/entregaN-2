// Variables
const users = JSON.parse(localStorage.getItem('users')) || []
let userLoged = JSON.parse(localStorage.getItem('loggedInUser'))

// Elementos del DOM
const root = document.getElementById('root');
const loginForm = document.getElementById('formulario-ingreso')
const registerLink = document.getElementById('register-link')
const accountSection = document.getElementById('account-section')
const loginSection = document.getElementById('seccion-ingreso')
const userNameDisplay = document.getElementById('user-name')
const userBalanceDisplay = document.getElementById('user-balance')
const depositButton = document.getElementById('deposit-button')
const transferButton = document.getElementById('transfer-button')
const logoutButton = document.getElementById('logout-button')
const mensajeAlert = document.getElementById('alert')


const llamadoAlert = (titleAlert, dataAlert, tm, classL) => {

    if (document.querySelector('.appendAlert')) {
        document.querySelector('.appendAlert').remove()
    }


    const mensajeAlert = document.createElement('div')
    mensajeAlert.className = "appendAlert"


    mensajeAlert.innerHTML = `
        <h4 class="${classL}">${titleAlert}</h4>
        <p>${dataAlert}</p>
        
    `;


    document.body.appendChild(mensajeAlert)

}



if (userLoged) {
    loginSection.style.display = 'none'
    accountSection.style.display = 'block'
    userNameDisplay.textContent = userLoged.userName;
    userBalanceDisplay.textContent = userLoged.balance?.toFixed(2) || '0.00'
}


//VALIDACION DE USUARIO

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const userDNI = document.getElementById('ingreso-dni').value
    const password = document.getElementById('login-password').value

    const user = users.find(u => u.userDNI === userDNI && u.userPassword === password)

    if (user) {
        userLoged = user
        localStorage.setItem('loggedInUser', JSON.stringify(userLoged))
        loginSection.style.display = 'none'
        accountSection.style.display = 'flex'
        userNameDisplay.textContent = userLoged.userName
        userBalanceDisplay.textContent = userLoged.balance?.toFixed(2) || '0.00'

    } else {

        llamadoAlert("Error", "El Usuario o Contraseña son Incorrectos", 3000, "error")

    }
})


//REGISTRO DE USUARIO

registerLink.addEventListener('click', (e) => {
    root.innerHTML = `
        <section id="register-section">
            <h2>Crea Tu Nueva Cuenta</h2>
            <form id="register-form">
                <label for="register-username">Usuario:</label>
                <input type="text" id="register-username" required>
                <label for="register-password">Contraseña:</label>
                <input type="password" id="register-password" required>
                <label for="register-dni">DNI:</label>
                <input type="text" id="register-dni" required>
                <button type="submit">Registrarse</button>
            </form>
        </section>
    `;

    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault()
        const newUserName = document.getElementById('register-username').value
        const newUserPassword = document.getElementById('register-password').value
        const newUserDNI = document.getElementById('register-dni').value

        const checkUser = users.find(u => u.userName === newUserName)

        if (checkUser) {
            llamadoAlert("Error", "El Usuario ya existe.. Intentelo de Nuevo", 3000, "error")
        } else {
            const newUser = {
                userName: newUserName,
                userPassword: newUserPassword,
                userDNI: newUserDNI,
                balance: 0
            };
            users.push(newUser)
            localStorage.setItem('users', JSON.stringify(users))
            llamadoAlert('Feiliciades', 'Se ha registrado con éxito', 3000);

        }
    });
});

//Boton para cerrar sesion 

logoutButton.addEventListener('click', () => {
    llamadoAlert(userLoged.userName, "Hasta la proxima", 3000, "none")

    userLoged = null;
    localStorage.removeItem('loggedInUser')
    accountSection.style.display = 'none'
    loginSection.style.display = 'block'

});


//Boton para Deposito

depositButton.addEventListener('click', () => {
    root.innerHTML = `
        <div id="deposit-modal"> 
            <h2>Realizar Depósito</h2>
            <form id="deposit-form">
                <label for="deposit-amount">Monto a depositar:</label>
                <input type="number" id="deposit-amount" min="0.01" step="0.01" required>
                <button type="submit">Depositar</button>
            </form> 
        </div>    
    `;

    document.getElementById('deposit-form').addEventListener('submit', (e) => {
        e.preventDefault()
        const amount = parseFloat(document.getElementById('deposit-amount').value)

        if (!isNaN(amount) && amount > 0) {
            userLoged.balance += amount
            userBalanceDisplay.textContent = userLoged.balance.toFixed(2)
            localStorage.setItem('loggedInUser', JSON.stringify(userLoged))

            const userIndex = users.findIndex(u => u.userName === userLoged.userName)
            if (userIndex !== -1) {
                users[userIndex] = userLoged
                localStorage.setItem('users', JSON.stringify(users))
            }
            llamadoAlert("Depostio realizado", `Se deposito : ${amount}`, 3000, "success")

        }
    });
});

//Boton para Trasferencia 


transferButton.addEventListener('click', () => {
    root.innerHTML = `
        <div id="transfer-modal"> 
            <h2>Realizar Transferencia</h2>
            <form id="transfer-form">
                <label for="recipient-DNI">DNI del Destinatario:</label>
                <input type="text" id="recipient-DNI" required>
                <label for="transfer-amount">Monto a transferir:</label>
                <input type="number" id="transfer-amount" min="0.01" step="0.01" required>
                <button type="submit">Transferir</button>
            </form> 
        </div>    
    `;

    document.getElementById('transfer-form').addEventListener('submit', (e) => {
        e.preventDefault()
        const recipientDNI = document.getElementById('recipient-DNI').value
        const amount = parseFloat(document.getElementById('transfer-amount').value)
        const recipient = users.find(u => u.userDNI === recipientDNI)

        if (recipient && !isNaN(amount) && amount > 0 && userLoged.balance >= amount) {

            userLoged.balance -= amount
            recipient.balance += amount


            userBalanceDisplay.textContent = userLoged.balance.toFixed(2)


            localStorage.setItem('loggedInUser', JSON.stringify(userLoged))


            const userIndex = users.findIndex(u => u.userDNI === userLoged.userDNI)
            const recipientIndex = users.findIndex(u => u.userDNI === recipient.userDNI)

            if (userIndex !== -1) users[userIndex] = userLoged
            if (recipientIndex !== -1) users[recipientIndex] = recipient

            localStorage.setItem('users', JSON.stringify(users))

            llamadoAlert("Trasferecia realizado con Exito", `Se Transfirio: $${amount} Al Usuario con el DNI: ${(recipientDNI)} `, 3000, "success")
        } else {
            llamadoAlert("Lo Sentimos", `Transferencia inválida o saldo insuficiente`, 3000, "error")

        }
    });
});








