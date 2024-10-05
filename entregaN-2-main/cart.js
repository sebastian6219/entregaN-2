let userLoged = JSON.parse(localStorage.getItem('loggedInUser'))

const root = document.getElementById('root')

function updateUserLoged(updatedUser) {
    localStorage.setItem('loggedInUser', JSON.stringify(updatedUser))
    location.reload()
}

if (!userLoged) {
    root.innerHTML = `<p  class = "none-products">DEBES INICIAR SESIÓN PARA VER LAS ORDENES DE COMPRA</p>`

} else {
    if (userLoged.tarjetas && userLoged.tarjetas.length > 0) {
        const container = document.createElement('div')
        container.className = "conteiner-order"
        container.innerHTML = `<p class = "order-title">Todas Las Ordenes</p>`
        userLoged.tarjetas.forEach((e, index) => {
            const productElement = document.createElement('div')
            productElement.className = "product"
            productElement.innerHTML = `
                <h3>Producto solicitado: Tarjeta ${e}</h3>
                <p>Nos comunicaremos pronto para efectuar la entrega de tu pedido</p>
                <button id="remove-${index}">Eliminar Orden</button>
            `

            productElement.querySelector(`#remove-${index}`).onclick = function () {
                userLoged.tarjetas.splice(index, 1)
                updateUserLoged(userLoged)
            }

            container.appendChild(productElement)
        })

        root.appendChild(container)
    } else {
        root.innerHTML = `
            <div id= "empty-cart">
                <h4>Carrito Vacio</h4>
                <p>Te invitamos a que veas nuestra lista de productos</p>
                <button id="verProductos">Ver Aquí</button>
            </div>
        `

        document.getElementById('verProductos').onclick = function () {
            window.location.href = 'productos.html'
        }
    }
}