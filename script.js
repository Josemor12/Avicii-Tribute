// ==================== CONTROL DE AUDIO CON REPRODUCCIÓN AUTOMÁTICA EN CADENA ====================
let currentAudio = null;
let currentBook = null;
let currentIndex = -1;          // Índice de la canción actual (0..9)
let isAutoPlaying = false;       // Bandera para evitar bucles al hacer clic manual
let autoPlayTimer = null;        // Timer de respaldo (fallback)

const musicIndicator = document.getElementById('musicIndicator');
const currentSongSpan = document.getElementById('currentSong');

// Obtener todos los elementos en el orden visual (nth-child orden natural)
const bookOuters = Array.from(document.querySelectorAll('.book-outer'));
const totalSongs = bookOuters.length;

function clearAutoTimer() {
    if (autoPlayTimer) {
        clearTimeout(autoPlayTimer);
        autoPlayTimer = null;
    }
}

function stopCurrentAudio(resetIndexFlag = false) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        // Remover event listener para evitar múltiples 'ended'
        currentAudio.removeEventListener('ended', onAudioEnd);
        currentAudio = null;
    }
    if (currentBook) {
        currentBook.classList.remove('playing');
        currentBook = null;
    }
    if (!resetIndexFlag) {
        // No reseteamos el índice al parar manualmente (por cambio de canción)
    } else {
        // Solo si se requiere reinicio completo (contexto externo)
        if (!isAutoPlaying) currentIndex = -1;
    }
    if (musicIndicator && !currentAudio) {
        // No ocultamos inmediatamente si estamos en medio de una transición
        if (!isAutoPlaying) {
            musicIndicator.classList.remove('show');
            currentSongSpan.textContent = '...';
        }
    }
    clearAutoTimer();
}

// Función que se ejecuta cuando una canción termina naturalmente
function onAudioEnd() {
    if (!currentAudio) return;
    // Prevenir recursión si se llama mientras se destruye el audio
    if (isAutoPlaying) return;
    
    isAutoPlaying = true;
    
    // Determinar siguiente índice
    let nextIdx = currentIndex + 1;
    if (nextIdx >= totalSongs) nextIdx = 0; // Ciclo infinito: volver al inicio
    
    const nextBook = bookOuters[nextIdx];
    if (nextBook) {
        const nextSongName = nextBook.getAttribute('data-song');
        const nextAudioUrl = nextBook.getAttribute('data-audio');
        // Limpiar el audio actual (ya terminó) sin resetear el indicador visual
        if (currentAudio) {
            currentAudio.removeEventListener('ended', onAudioEnd);
            currentAudio = null;
        }
        if (currentBook) currentBook.classList.remove('playing');
        // Reproducir siguiente canción
        playAudioByBookElement(nextBook, nextAudioUrl, nextSongName, true);
    } else {
        // Fallback: detener todo
        stopCurrentAudio(true);
        isAutoPlaying = false;
        if (musicIndicator) musicIndicator.classList.remove('show');
    }
    isAutoPlaying = false;
}

// Función principal de reproducción (con parámetro fromAuto para no interferir)
function playAudioByBookElement(bookElement, audioUrl, songName, fromAuto = false) {
    // Si ya se está reproduciendo la misma canción y es reproducción automática, evitar reiniciar
    if (currentAudio && currentBook === bookElement && !currentAudio.paused && fromAuto) {
        if (isAutoPlaying) return;
    }
    
    // Detener cualquier reproducción actual (pero preservar el estado de índice si es auto)
    if (currentAudio) {
        currentAudio.removeEventListener('ended', onAudioEnd);
        if (currentAudio.pause) currentAudio.pause();
        currentAudio = null;
    }
    if (currentBook) {
        currentBook.classList.remove('playing');
        currentBook = null;
    }
    clearAutoTimer();
    
    // Crear nuevo audio SIN loop (para que termine y dispare 'ended')
    const newAudio = new Audio(audioUrl);
    newAudio.loop = false;      // Desactivado para que suene una vez y pase a la siguiente
    newAudio.volume = 0.7;
    
    currentAudio = newAudio;
    currentBook = bookElement;
    currentBook.classList.add('playing');
    
    // Actualizar índice basado en la posición real en la lista
    const idx = bookOuters.indexOf(bookElement);
    if (idx !== -1) currentIndex = idx;
    
    // Actualizar UI
    if (currentSongSpan && musicIndicator) {
        currentSongSpan.textContent = songName;
        musicIndicator.classList.add('show');
    }
    
    // Evento cuando termina la reproducción
    currentAudio.addEventListener('ended', onAudioEnd);
    
    // Reproducir con manejo de errores
    currentAudio.play().catch(error => {
        console.error('Error reproduciendo audio:', error);
        // Si falla por política de autoplay, mostrar mensaje discreto
        if (!fromAuto) {
            alert(`No se pudo reproducir "${songName}".\n${error.message}\n\nIntenta hacer clic nuevamente.`);
        }
        // Limpiar el audio defectuoso
        if (currentAudio) {
            currentAudio.removeEventListener('ended', onAudioEnd);
            currentAudio = null;
        }
        if (currentBook) {
            currentBook.classList.remove('playing');
            currentBook = null;
        }
        musicIndicator.classList.remove('show');
        currentSongSpan.textContent = '...';
        currentIndex = -1;
    });
}

// Reproducción manual por clic en libro
function playAudio(bookElement, audioUrl, songName) {
    // Si estamos en medio de una auto-reproducción y el usuario hace clic, cancelamos el timer y banderas
    if (isAutoPlaying) {
        isAutoPlaying = false;
        clearAutoTimer();
    }
    // Detener el audio actual y eliminar el listener ended para evitar auto-next conflictivo
    if (currentAudio) {
        currentAudio.removeEventListener('ended', onAudioEnd);
        if (!currentAudio.paused) currentAudio.pause();
        currentAudio = null;
    }
    if (currentBook) {
        currentBook.classList.remove('playing');
        currentBook = null;
    }
    // Reproducir nueva canción manualmente
    playAudioByBookElement(bookElement, audioUrl, songName, false);
}

// Asignar eventos a cada libro
bookOuters.forEach(book => {
    const songName = book.getAttribute('data-song');
    const audioUrl = book.getAttribute('data-audio');
    book.addEventListener('click', (e) => {
        e.stopPropagation();
        playAudio(book, audioUrl, songName);
    });
    book.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        // Al hacer clic derecho paramos toda reproducción
        if (currentAudio) {
            currentAudio.removeEventListener('ended', onAudioEnd);
            currentAudio.pause();
            currentAudio = null;
        }
        if (currentBook) {
            currentBook.classList.remove('playing');
            currentBook = null;
        }
        currentIndex = -1;
        if (musicIndicator) musicIndicator.classList.remove('show');
        if (currentSongSpan) currentSongSpan.textContent = '...';
        clearAutoTimer();
        isAutoPlaying = false;
    });
});

console.log('🎵 Modo play automático activado: al terminar una canción se reproducirá la siguiente (orden circular). Haz clic en cualquier disco para iniciar.');

// ==================== PARTÍCULAS REDONDAS (colores variados) ====================
(function() {
    const styleSheet = document.createElement('style');
    let keyframesCSS = '';
    
    for (let i = 0; i < 150; i++) {
        const startX = Math.random() * 100;
        const startY = 100 + Math.random() * 30;
        const endX = Math.random() * 100;
        const endY = -20 - Math.random() * 40;
        const duration = 15 + Math.random() * 25;
        const delay = Math.random() * 30;
        
        keyframesCSS += `
            @keyframes move-particle-${i} {
                0% { transform: translate(${startX}vw, ${startY}vh); opacity: 0; }
                15% { opacity: ${0.3 + Math.random() * 0.5}; }
                85% { opacity: ${0.3 + Math.random() * 0.5}; }
                100% { transform: translate(${endX}vw, ${endY}vh); opacity: 0; }
            }
        `;
        
        const size = 2 + Math.random() * 8;
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animation = `move-particle-${i} ${duration}s linear ${delay}s infinite`;
        
        const inner = document.createElement('div');
        inner.className = 'particle-inner';
        
        const colorType = Math.random();
        let gradientColor;
        if (colorType < 0.4) {
            const hue = 180 + Math.random() * 80;
            gradientColor = `radial-gradient(circle, hsl(${hue}, 100%, 70%), hsl(${hue}, 100%, 50%))`;
        } else if (colorType < 0.7) {
            const hue = 45 + Math.random() * 20;
            gradientColor = `radial-gradient(circle, hsl(${hue}, 100%, 65%), hsl(${hue}, 100%, 45%))`;
        } else {
            const whiteShade = 80 + Math.random() * 20;
            gradientColor = `radial-gradient(circle, hsl(0, 0%, 100%), hsl(200, 30%, ${whiteShade}%))`;
        }
        
        inner.style.background = gradientColor;
        inner.style.animation = `particlePulse ${1 + Math.random() * 2}s ease-in-out infinite alternate`;
        
        particle.appendChild(inner);
        document.body.appendChild(particle);
    }
    
    styleSheet.textContent = keyframesCSS;
    document.head.appendChild(styleSheet);
})();

// ==================== SÍMBOLO ◢◤ FLOTANTE ====================
(function() {
    const symbolStyle = document.createElement('style');
    let symbolKeyframes = '';
    const symbolCount = 24;
    
    for (let i = 0; i < symbolCount; i++) {
        const isLeft = Math.random() < 0.5;
        let startX, endX;
        
        if (isLeft) {
            startX = Math.random() * 25;
            endX = Math.random() * 25;
        } else {
            startX = 75 + Math.random() * 18;
            endX = 75 + Math.random() * 18;
        }
        
        const startY = 100 + Math.random() * 20;
        const endY = -15 - Math.random() * 35;
        const duration = 10 + Math.random() * 20;
        const delay = Math.random() * 30;
        
        symbolKeyframes += `
            @keyframes move-symbol-${i} {
                0% { transform: translate(${startX}vw, ${startY}vh); opacity: 0; }
                20% { opacity: 0.5; }
                80% { opacity: 0.5; }
                100% { transform: translate(${endX}vw, ${endY}vh); opacity: 0; }
            }
        `;
        
        const symbolDiv = document.createElement('div');
        symbolDiv.className = 'symbol-particle';
        symbolDiv.textContent = '◢◤';
        symbolDiv.style.fontSize = '14px';
        symbolDiv.style.color = `rgba(255, 255, 255, ${0.35 + Math.random() * 0.35})`;
        symbolDiv.style.fontWeight = 'bold';
        symbolDiv.style.letterSpacing = '2px';
        symbolDiv.style.animation = `move-symbol-${i} ${duration}s linear ${delay}s infinite`;
        symbolDiv.style.textShadow = '0 0 3px rgba(255,255,255,0.5)';
        
        document.body.appendChild(symbolDiv);
    }
    
    symbolStyle.textContent = symbolKeyframes;
    document.head.appendChild(symbolStyle);
})();