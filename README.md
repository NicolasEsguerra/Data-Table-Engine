# 📊 Data-Table Engine

Este proyecto es una herramienta web interactiva desarrollada para el taller **"Manipulación Avanzada de Estructuras de Datos (Tablas)"**. Permite cargar, visualizar y manipular conjuntos de datos en formato JSON completamente en memoria y en tiempo real, utilizando únicamente tecnologías web estándar (sin frameworks adicionales).

Desarrollado por: Nicolás Esguerra Castro,

Esteban David Gomez Serna, Emily Dayana Solano García, Juan Andrés Quinche García.

Materia: Estructuras de Información

Fecha: 6 de Abril 2026


## ✨ Características Principales 

* **Módulo de Carga:** Integración de la API `FileReader` para cargar archivos `.json` locales dinámicamente o restaurar un set de datos de prueba.
* **Búsqueda en Caliente (Filter):** Filtrado instantáneo de registros por nombre mientras el usuario teclea.
* **Ordenamiento Dinámico (Sort):** Reordenamiento ascendente y descendente al hacer clic en las cabeceras de la tabla.
* **Edición Inline (Map):** Modificación de las notas de los estudiantes directamente en la celda, actualizando el estado de manera inmutable.
* **Cálculo Agregado (Reduce):** Fila de totales en el pie de la tabla que calcula automáticamente el promedio de notas de los datos que están actualmente renderizados.

## 🛠️ Tecnologías Utilizadas

* HTML5
* CSS3 (Estilos internos)
* Vanilla JavaScript (ES6+)

## 🚀 Cómo ejecutar el proyecto

Al ser un proyecto desarrollado en Vanilla JavaScript, no requiere instalación de dependencias ni compilación.

1. Clona este repositorio o descarga los archivos.
2. Abre el archivo `index.html` directamente en tu navegador web.
3. *Opcional:* Para una mejor experiencia de desarrollo, ábrelo utilizando la extensión "Live Server" en Visual Studio Code.

---

## 🧠 Explicación Técnica: Lógica de Ordenamiento (Sort)

Para cumplir con los estándares de calidad del desarrollo frontend, la funcionalidad de ordenamiento se implementó respetando rigurosamente el principio de **inmutabilidad de los datos**.

La lógica principal se encuentra en la función `renderizarTabla()` y opera de la siguiente manera:

1.  **Protección del Estado Original:** Antes de aplicar cualquier ordenamiento, se crea una copia superficial (shallow copy) del estado global utilizando el *spread operator*: `let datosProcesados = [...datos];`. Esto evita que el método `.sort()` mute la tabla original de forma destructiva.
2.  **Gestión de Dirección:** Se utilizan dos variables de estado (`columnaOrden` y `direccionOrden`) para rastrear qué columna se seleccionó y si el orden debe ser ascendente (`asc`) o descendente (`desc`). Al hacer clic repetidamente en la misma columna, el estado alterna (toggle) entre ambas direcciones.
3.  **Función Comparadora Tipada:** Dentro del método `Array.prototype.sort()`, se evalúan los tipos de datos para aplicar el algoritmo correcto:
    * **Para Cadenas de Texto (Strings):** Si la columna seleccionada contiene texto (ej. "nombre"), se utiliza el método nativo `localeCompare()`. Esto garantiza un ordenamiento alfabético preciso que respeta las reglas del idioma (como tildes o la letra ñ), lo cual no es posible usando simples operadores matemáticos.
    * **Para Números (Numbers):** Si la columna contiene valores numéricos (ej. "id", "edad", "nota"), se realiza una sustracción directa matemática (`a - b` para ascendente o `b - a` para descendente).
4.  **Renderizado Reactivo:** Una vez el arreglo temporal está ordenado (y filtrado), se inyecta en el DOM utilizando `.map()` para generar las filas de la tabla dinámicamente.

**Snippet representativo del ordenamiento:**

```javascript
// Dentro del motor de renderizado:
if (columnaOrden) {
    datosProcesados.sort((a, b) => {
        let valorA = a[columnaOrden];
        let valorB = b[columnaOrden];

        if (typeof valorA === 'string') {
            return direccionOrden === "asc" 
                ? valorA.localeCompare(valorB) 
                : valorB.localeCompare(valorA);
        }

        return direccionOrden === "asc" ? valorA - valorB : valorB - valorA;
    });
}
