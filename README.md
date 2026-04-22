## ◢ ◤ Avicii Tribute - My Top 10 ◢ ◤

Un tributo interactivo y visualmente inmersivo dedicado a la leyenda de la música electrónica, **Tim Bergling (Avicii)**.

<img width="1470" height="956" alt="Captura de pantalla 2026-04-20 a la(s) 8 47 52 p  m" src="https://github.com/user-attachments/assets/c91dd068-615f-4428-96f9-651b6ce52f27" />


## Características Principales

* **Rueda Interactiva (Vinyl Wheel):** Una interfaz circular dinámica donde cada canción está representada por un libro/vinilo con efecto 3D al pasar el cursor (hover).
* **Reproducción Automática en Cadena:** Sistema de audio inteligente en JavaScript que detecta el final de una pista y salta automáticamente a la siguiente de forma circular.
* **Atmósfera Visual:**
    * **Partículas Dinámicas:** Un sistema de partículas redondas con gradientes de color (celestes, dorados y blancos) que flotan en el fondo.
    * **Símbolos Flotantes:** El icónico logo `◢◤` de Avicii integrado como elementos flotantes con animaciones aleatorias.
    * **Diseño Responsive:** Adaptado para dispositivos móviles, tablets y pantallas de escritorio.
* **Control Intuitivo:**
    * `Clic Izquierdo`: Reproducir canción seleccionada.
    * `Clic Derecho`: Detener reproducción y limpiar el estado actual.

## Tecnologías Utilizadas

* **HTML5:** Estructura semántica para los contenedores de audio y la rueda interactiva.
* **CSS3:** Animaciones complejas (`@keyframes`) para la rotación de la rueda y las partículas.
    * Efectos de transformación 3D (`preserve-3d`, `rotateY`).
    * Filtros de desenfoque (`backdrop-filter`) para una interfaz moderna.
* **JavaScript:** Lógica personalizada para el control de la API de Audio de HTML5, gestión de eventos y generación dinámica de efectos visuales.

## Responsive View

<img width="2400" height="1561" alt="Captura de pantalla 2026-04-21 a la(s) 3 31 18 p  m -Photoroom" src="https://github.com/user-attachments/assets/818f766d-5756-4eea-991d-fe6812659fef" />
<img width="2400" height="1561" alt="Captura de pantalla 2026-04-21 a la(s) 3 26 14 p  m -Photoroom" src="https://github.com/user-attachments/assets/5c1fb546-3f22-44a2-9b72-7d831c0064a3" />
<img width="2400" height="1561" alt="Captura de pantalla 2026-04-21 a la(s) 3 26 38 p  m -Photoroom" src="https://github.com/user-attachments/assets/762ee222-339e-4a7d-bf11-142780ccf6af" />


## 📂 Estructura del Proyecto

```text
├── index.html      # Estructura principal y contenedores de canciones
├── styles.css      # Estilos visuales, animaciones y responsive design
├── script.js      # Lógica de audio y sistemas de partículas
├── img/            # Recursos visuales (portadas de álbumes y fondos)
└── music/          # Archivos de audio (MP3/M4A)
