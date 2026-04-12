// --- MÓDULO DE CARGA (FileReader API) ---
const inputFile = document.getElementById("inputFile");

inputFile.addEventListener("change", (evento) => {
    // 1. Obtenemos el archivo seleccionado
    const archivo = evento.target.files[0];
    
    // Si el usuario canceló la selección, no hacemos nada
    if (!archivo) return; 

    // 2. Creamos una instancia de FileReader
    const lector = new FileReader();

    // 3. Definimos qué hacer cuando termine de leer el archivo
    lector.onload = (e) => {
        try {
            // El resultado de la lectura es texto plano, lo parseamos a JSON
            const datosCargados = JSON.parse(e.target.result);
            
            // Validamos que el JSON sea efectivamente un arreglo (Tabla)
            if (Array.isArray(datosCargados)) {
                datos = datosCargados; // Reemplazamos el estado global
                
                // Limpiamos la barra de búsqueda por si había algo escrito
                textoBusqueda = "";
                inputBusqueda.value = "";
                
                // Renderizamos la tabla con los nuevos datos
                renderizarTabla();
                alert("¡Datos cargados exitosamente!");
            } else {
                alert("El archivo JSON no tiene el formato esperado (debe ser un arreglo [ ]).");
            }
        } catch (error) {
            alert("Error: El archivo no es un JSON válido.");
            console.error(error);
        }
        
        // Limpiamos el input para permitir cargar el mismo archivo otra vez si se desea
        inputFile.value = ""; 
    };

    // 4. Ordenamos leer el archivo como texto
    lector.readAsText(archivo);
});

// Función para el botón de "Restaurar Datos de Prueba"
function cargarDatosPrueba() {
    datos = [
        { id: 1, nombre: "Ana Gómez", edad: 20, nota: 4.5 },
        { id: 2, nombre: "Luis Pérez", edad: 22, nota: 2.8 },
        { id: 3, nombre: "Carlos Ruiz", edad: 21, nota: 3.9 },
        { id: 4, nombre: "Marta Díaz", edad: 19, nota: 4.1 },
        { id: 5, nombre: "Jorge Luna", edad: 23, nota: 3.0 }
    ];
    textoBusqueda = "";
    inputBusqueda.value = "";
    renderizarTabla();
}

// Variables de estado para la UI
let textoBusqueda = "";
let columnaOrden = null;
let direccionOrden = "asc";

// Referencias al DOM
const inputBusqueda = document.getElementById("inputBusqueda");
const cuerpoTabla = document.getElementById("cuerpoTabla");
const celdaPromedio = document.getElementById("celdaPromedio");

// --- MÓDULO DE BÚSQUEDA EN CALIENTE ---
inputBusqueda.addEventListener("input", (evento) => {
    textoBusqueda = evento.target.value.toLowerCase();
    renderizarTabla();
});

// --- MÓDULO DE ORDENAMIENTO (SORT) ---
function ordenarPor(llave) {
    if (columnaOrden === llave && direccionOrden === "asc") {
        direccionOrden = "desc";
    } else {
        direccionOrden = "asc";
    }
    columnaOrden = llave;
    
    // Limpiar flechas visuales
    document.querySelectorAll("th span").forEach(span => span.innerText = "");
    // Mostrar flecha en la columna actual
    document.getElementById(`flecha-${llave}`).innerText = direccionOrden === "asc" ? " ↑" : " ↓";

    renderizarTabla();
}

// --- MÓDULO DE EDICIÓN INLINE (MAP) ---
// Se llama desde el HTML cuando el usuario cambia un valor en el input
function actualizarNota(id, nuevaNota) {
    // Usamos map para mantener la inmutabilidad creando un nuevo arreglo
    datos = datos.map(fila => {
        if (fila.id === id) {
            return { ...fila, nota: parseFloat(nuevaNota) || 0 };
        }
        return fila;
    });
    renderizarTabla();
}

// --- MOTOR PRINCIPAL: PROCESAR Y RENDERIZAR ---
function renderizarTabla() {
    // 1. Clonar datos para no mutar el original
    let datosProcesados = [...datos];

    // 2. Aplicar Filter (Búsqueda)
    if (textoBusqueda) {
        datosProcesados = datosProcesados.filter(fila => 
            fila.nombre.toLowerCase().includes(textoBusqueda)
        );
    }

    // 3. Aplicar Sort (Ordenamiento)
    if (columnaOrden) {
        datosProcesados.sort((a, b) => {
            let valorA = a[columnaOrden];
            let valorB = b[columnaOrden];

            // Para strings (nombres), usamos localeCompare
            if (typeof valorA === 'string') {
                return direccionOrden === "asc" 
                    ? valorA.localeCompare(valorB) 
                    : valorB.localeCompare(valorA);
            }

            // Para números (id, edad, nota)
            return direccionOrden === "asc" ? valorA - valorB : valorB - valorA;
        });
    }

    // 4. Aplicar Reduce (Cálculo Agregado)
    let promedio = 0;
    if (datosProcesados.length > 0) {
        const sumaTotal = datosProcesados.reduce((acumulador, fila) => acumulador + fila.nota, 0);
        promedio = (sumaTotal / datosProcesados.length).toFixed(2);
    }
    celdaPromedio.innerText = promedio;

    // 5. Inyectar en el DOM usando Map
    cuerpoTabla.innerHTML = datosProcesados.map(fila => `
        <tr>
            <td>${fila.id}</td>
            <td>${fila.nombre}</td>
            <td>${fila.edad}</td>
            <td>
                <input type="number" step="0.1" value="${fila.nota}" 
                       onchange="actualizarNota(${fila.id}, this.value)">
            </td>
        </tr>
    `).join('');
}

// Inicializar la tabla la primera vez que carga la página
renderizarTabla();