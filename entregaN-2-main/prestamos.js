let userLoged = JSON.parse(localStorage.getItem('loggedInUser'))
const root = document.getElementById('root')

const generarSimulador = () => {
    root.innerHTML = `
        <h2>Simulación de Préstamos</h2>
        <div class="prestamos-container">
            <div>
                <form id="loan-form" class="loan-form">
                    <label for="amount">Monto del Préstamo:</label>
                    <input type="number" id="amount" required>

                    <label for="years">Años:</label>
                    <input type="number" id="years" required>
                    
                    <button type="submit">Calcular</button>
                </form>
            </div>
            <div id="result" class="result" style="display: none;"></div>
        </div>
    `

    const form = document.getElementById('loan-form')
    const resultDiv = document.getElementById('result')

    form.addEventListener('submit', (e) => {
        e.preventDefault()

        const amount = parseFloat(document.getElementById('amount').value)
        const interest = 50 / 100 / 12
        const years = parseFloat(document.getElementById('years').value) * 12

        const x = Math.pow(1 + interest, years)
        const monthly = (amount * x * interest) / (x - 1)

        if (isFinite(monthly)) {
            resultDiv.innerHTML = `
                <h3>Resultados</h3>
                <span> Interes al: 50%</span>
                <p>Pago Mensual: $${monthly.toFixed(2)}</p>
                <p>Total a Pagar: $${(monthly * years).toFixed(2)}</p>
                <p>Intereses Totales: $${((monthly * years) - amount).toFixed(2)}</p>
            `
            resultDiv.style.display = 'block'
        } else {
            resultDiv.innerHTML = '<p>Por favor, revisa los valores ingresados.</p>'
            resultDiv.style.display = 'block'
        }
    })
}

const mostrarError = () => {
    root.innerHTML = `<p class="none-products">DEBES INICIAR SESIÓN PARA VER LA SIMULACION DE PRESTAMOS</p>`
}

const verificarUsuario = () => {
    if (!userLoged || !userLoged.email) {
        mostrarError()
    } else {
        generarSimulador()
    }
}

verificarUsuario()
