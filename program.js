// definicion de los productos. base de datos
class Producto {
    constructor(nombre, precio, index) {
        this.nombre = nombre;
        this.precio = precio;
        this.index = index;
    }
}

const productos = [
    new Producto("Vino + Gaseosa", 5100, 1),
    new Producto("Vino + Jugo", 4675, 2),
    new Producto("Gaseosa", 2000, 3),
    new Producto("Jugo", 1500, 4),
    new Producto("Vino", 4000, 5),
    new Producto("Cerveza", 3000, 6),
];

// para generar array de productos en el htmll
const visualProductos = (arregloProductos) => {
    const seccProductos = document.getElementById(`seccProductos`)
    seccProductos.innerHTML = ""

    // para generar visualizacion de arreglo de productos
    arregloProductos.forEach(({ nombre, precio, index }) => {
        seccProductos.innerHTML += `
        <div class="col" id="promo${index}">
            <h3>${nombre}</h3>
            <img src="./assets/img/${nombre}.jpg" class="fotoProducto" alt="${nombre}">
            <p>$${precio}</p>
            <form>
                <label for="cantidad${index}">Cantidad:</label>
                <input id="cantidad${index}" placeholder="1" required type="text" name="cant">
            </form>
            <button id="boton${index}" class="boton">Agregar</button>
        </div>`;
    });

    // Asignar evento de clic al botón posterior a HTML
    arregloProductos.forEach(({ precio, nombre, index }) => {
        const boton = document.getElementById(`boton${index}`);
        boton.addEventListener("click", (e) => {
            e.preventDefault();
            let cantidadProd = Number(document.getElementById(`cantidad${index}`).value);

            // validar que la cantidad sea entero postiivo
            if (isNaN(cantidadProd) || cantidadProd <= 0) {
                cantidadProd = 1;
            }

            actualizarCarrito(cantidadProd, precio, nombre);
        });
    });
}

// llamo a la funcion para mostrar en HTML
visualProductos(productos)

// el total del carro empieza vacio
let cantidadCarrito = 0
let precioCarrito = 0

const botonPagar = document.getElementById(`btnPagar`);
const mostrarBotonPagar = () => {
    if (precioCarrito > 0) {
        botonPagar.classList.toggle(`ocultar`);
    }
}

// funcioanmiento boton pagar
botonPagar.addEventListener("click", () => {
    const usuario = document.getElementById(`inputUsuario`).value;
    const contrasena = document.getElementById(`inputContra`).value;
    const usuarioValido = verificarUsuario(usuario, contrasena); // Verificar si el usuario es válido

    if (usuarioValido && precioCarrito > 0) {
        mensajePago.innerHTML = `<p>Pago realizado con éxito. Gracias por su compra.</p>`;
        // Aquí se puede añadir el flujo de pago o limpiar el carrito si es necesario
    } else if (!usuarioValido) {
        mensajePago.innerHTML = `<p>Debe iniciar sesión para realizar el pago. Por favor, introduzca sus datos.</p>`;
    }
});

// Función para actualizar el carrito
const actualizarCarrito = (cantidad, precio, nombre) => {
    const totalesCarrito = document.getElementById(`totalesCarrito`);
    const totalFinal = document.getElementById(`totalFinal`);

    // sumar la cantidad de productos
    cantidadCarrito += cantidad;
    precioCarrito += cantidad * precio;

    // Crea un nuevo elemento agregado al carrito
    const nuevoProducto = document.createElement(`div`);
    nuevoProducto.classList.add(`productoCarrito`);
    nuevoProducto.innerHTML = `${nombre}: ${cantidad} x $${precio} = $${cantidad * precio}`;
    totalesCarrito.appendChild(nuevoProducto);

    // Mostrar el total general enel carrito
    totalFinal.innerHTML = `
    <div class="subrayado"> Total del carrito: $${precioCarrito} </div>`;

    mostrarBotonPagar();
}

const btnOcultar = document.getElementById(`btnOcultar`)

btnOcultar.addEventListener("click", () => {
    const productosCarrito = document.querySelectorAll(`.productoCarrito`); // Solo los productos
    productosCarrito.forEach(producto => {
        producto.classList.toggle(`ocultar`);
    });

    if (productosCarrito[0].classList.contains(`ocultar`)) {
        btnOcultar.innerText = "Mostrar Productos";
    } else {
        btnOcultar.innerText = "Ocultar Productos";
    }
})

// empiezo con la definicion de usuarios
// para obtener la base de datos de usuarios desde localStorage
const obtenerUsuarios = () => {
    const usuarios = localStorage.getItem(`usuariosDB`);
    return usuarios ? JSON.parse(usuarios) : [];
};

// guardar la base de datos de usuarios
const guardarUsuarios = (usuarios) => {
    localStorage.setItem(`usuariosDB`, JSON.stringify(usuarios));
};

// exitencia de usuarios. retorna true si existen ambos
const verificarUsuario = (usuario, contrasena) => {
    const usuarios = obtenerUsuarios();
    const usuarioEncontrado = usuarios.find(user => user.usuario === usuario);

    if (usuarioEncontrado && usuarioEncontrado.contrasena === contrasena) {
        return true;
    }
    return false;
};

// para agregar un nuevo usuario
const agregarUsuario = (usuario, contrasena) => {
    const usuarios = obtenerUsuarios();
    usuarios.push({ usuario, contrasena });
    guardarUsuarios(usuarios);
};

document.getElementById(`loginForm`).addEventListener(`submit`, (e) => {
    e.preventDefault();

    const usuario = document.getElementById(`inputUsuario`).value;
    const contrasena = document.getElementById(`inputContra`).value;
    const mensaje = document.getElementById(`mensaje`);

    if (usuario === "" || contrasena === "") {
        mensaje.innerHTML = "Usuario o contrasena vacio"
        return;
    }

    if (verificarUsuario(usuario, contrasena)) {
        mensaje.innerHTML = `bienvenido ${usuario}`;

    } else {
        agregarUsuario(usuario, contrasena);
        mensaje.innerHTML = `Nuevo usuario "${usuario}" registrado`;
    }
});
// fin definicion de usuarios

// Llamo a la función para mostrar productos en HTML
visualProductos(productos);