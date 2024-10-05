let userLoged = JSON.parse(localStorage.getItem('loggedInUser'))

const root = document.getElementById('root')



if (!userLoged) {

    root.innerHTML = `<p class = "none-products">DEBES INICIAR SESIÓN PARA VER LOS PRODUCTOS</p>`


} else {

    root.innerHTML = `
                    <h2>Nuestras Tarjetas de Crédito</h2>
                    <p id="message"></p>
                    <section class="product">
                        <h3>Tarjeta ASA Clásica</h3>
                        <p>La tarjeta ideal para tus compras diarias.</p>
                        <button id="solicitar-clasica">Solicitar</button>
                    </section>
                    <section class="product">
                        <h3>Tarjeta ASA Oro</h3>
                        <p>Disfruta de beneficios exclusivos y mayores límites.</p>
                        <button id="solicitar-oro">Solicitar</button>
                    </section>    

                    `

    function solicitarTarjeta(type) {

        const message = document.getElementById('message')
        if (!userLoged.tarjetas) {
            userLoged.tarjetas = []
        }

        if (userLoged.tarjetas.includes(type)) {
            message.textContent = `Ya has solicitado la tarjeta ${type}.`
            message.classList.add('error')
        } else {
            userLoged.tarjetas.push(type)
            message.textContent = `Has solicitado la tarjeta ${type} exitosamente.`
            message.classList.add('success')
            localStorage.setItem('loggedInUser', JSON.stringify(userLoged))
        }


    }

    document.getElementById('solicitar-clasica').addEventListener('click', () => {
        solicitarTarjeta('ASA Clásica')
    });

    document.getElementById('solicitar-oro').addEventListener('click', () => {
        solicitarTarjeta('ASA Oro')
    })


}


