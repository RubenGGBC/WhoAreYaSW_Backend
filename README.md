# Who Are Ya? - Backend

## Descripción del Proyecto

Este repositorio contiene el backend del proyecto WhoAreYa, desarrollado con Node.js y Express, que gestiona la lógica del juego, los datos de jugadores, las estadísticas y sirve el frontend estático.

---

## Milestone 0: Definición de Arquitectura

### 2.1. Estructura del proyecto

**Opción elegida: C - Estructura Híbrida**

#### Justificación:
- **Lo mejor de ambos mundos**: Mantenemos `public/` para servir archivos estáticos del frontend (convención estándar de Express), mientras organizamos el código del backend de forma modular en `src/`.
- **Separación frontend/backend**: El frontend existente permanece en `public/` sin modificaciones, mientras que todo el código del servidor está organizado en `src/`.
- **Escalabilidad**: La estructura modular de `src/` facilita el crecimiento del backend sin afectar al frontend.
- **Convención de Express**: Express busca archivos estáticos en `public/` por defecto, lo que simplifica la configuración.
- **Claridad**: Es fácil de entender qué es frontend (`public/`) y qué es backend (`src/`), facilitando el trabajo en equipo.

---

### 2.2. Punto de entrada del servidor

**Opción elegida: B - server.js**

#### Justificación:
- **Simplicidad**: Un único archivo `server.js` en la raíz hace que sea fácil de entender dónde y cómo arranca la aplicación.
- **Coherencia con estructura modular**: Al usar estructura modular con `src/`, tiene sentido tener `server.js` en la raíz importando `src/app.js`.

---

### 2.3. Organización de carpetas

**Opción elegida: A - Por tipo**

#### Justificación:
- **Claridad inmediata**: Es fácil localizar todos los modelos, todas las rutas o todos los controladores de un vistazo.
- **Proyecto de tamaño pequeño-medio**: Para un juego como "WhoAreYa", la organización por tipo es suficiente y no genera carpetas excesivamente grandes.
- **Mantenibilidad**: Al tener pocas entidades principales (jugadores, partidas, estadísticas), agrupar por tipo resulta más eficiente que por dominio.
- **Separación de responsabilidades**: Cada carpeta tiene un propósito claro y único.

---

### 2.4. Gestión de configuración

**Opción elegida: B - Configuración centralizada**

#### Justificación:
- **Seguridad**: Validamos las variables de entorno en un único lugar, evitando errores en producción por variables faltantes o mal formateadas.
- **Documentación implícita**: El archivo de configuración sirve como documentación viva de qué variables usa la aplicación y para qué.
- **Prevención de errores**: Fallar rápido en el inicio si falta configuración crítica, en lugar de fallar en runtime.

#### Variables de entorno provisionales por definir:

```javascript
// src/config/index.js
module.exports = {
  // Servidor
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Base de datos
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/whoareya',
  
  // Sesiones
  sessionSecret: process.env.SESSION_SECRET || 'your-secret-key-here',
  sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE) || 86400000
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Juego
  solutionStartDate: process.env.SOLUTION_START_DATE || '2025-01-10',
};
```

---

### 2.5. Especificación: Rutas del sistema

#### Rutas de API

| Tipo | Método | Endpoint | Descripción | Autorización |
|------|--------|----------|-------------|--------------|
| API | GET | `/api/players` | Obtener lista de todos los jugadores disponibles | Pública |
| API | GET | `/api/players/:id` | Obtener información detallada de un jugador específico | Pública |
| API | GET | `/api/solution/:gameNumber` | Obtener ID de la solución del juego (ofuscado) | Pública |
| API | POST | `/api/stats` | Guardar estadísticas de una partida completada | Pública |
| API | GET | `/api/stats` | Obtener estadísticas globales del juego | Pública |
| API | GET | `/api/game/current` | Obtener número del juego actual basado en la fecha | Pública |
| API | GET | `/api/game/:number` | Obtener información de un juego específico por número | Pública |

#### Rutas de Vistas

| Tipo | Método | Endpoint | Descripción | Autorización |
|------|--------|----------|-------------|--------------|
| Vista | GET | `/` | Página principal del juego del día actual | Pública |
| Vista | GET | `/game/:number` | Página del juego de un día específico | Pública |

#### Rutas de Administración (Futuras ampliaciones)

| Tipo | Método | Endpoint | Descripción | Autorización |
|------|--------|----------|-------------|--------------|
| Admin | GET | `/admin/players` | Listar todos los jugadores con opciones de gestión | Admin |
| Admin | POST | `/admin/players` | Crear un nuevo jugador en la base de datos | Admin |
| Admin | PUT | `/admin/players/:id` | Actualizar información de un jugador existente | Admin |
| Admin | DELETE | `/admin/players/:id` | Eliminar un jugador de la base de datos | Admin |
| Admin | POST | `/admin/solutions` | Configurar las soluciones diarias del juego | Admin |
| Admin | GET | `/admin/stats` | Ver estadísticas detalladas del sistema | Admin |

---

## Estructura provisional del Proyecto

```
whoareya-backend/
├── .env.example                    
├── .gitignore                      
├── package.json                    
├── server.js                       
├── README.md                       
│
├── public/                         
│   └── frontend del proyecto                           
│
└── src/                            
    ├── app.js                     
    │
    ├── config/                     
    │   └── index.js                
    │
    ├── models/                     
    │   ├── Player.js               
    │   ├── Solution.js             
    │   └── Stats.js                       
    │
    ├── controllers/                
    │   ├── playerController.js     
    │   ├── gameController.js       
    │   └── statsController.js      
    │
    ├── routes/                     
    │   ├── index.js                
    │   ├── playerRoutes.js         
    │   ├── gameRoutes.js           
    │   └── statsRoutes.js          
    │
    └── middlewares/                
        ├── errorHandler.js         
        └── validator.js           
   
```

## Dependencias del Proyecto

### package.json (provisional propuesto)

```json
{
  "name": "whoareya-backend",
  "version": "1.0.0",
  "description": "Backend para el juego Who Are Ya? - Adivina el futbolista",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node src/db/seeders/seedPlayers.js && node src/db/seeders/seedSolutions.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.6.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.1",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```
---

## Instalación y Configuración

### Requisitos previos:
- Node.js
- MongoDB
- npm

### Pasos de instalación:

1. **Clonar el repositorio**:
```bash
git clone https://github.com/tu-usuario/whoareya-backend.git
cd whoareya-backend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
```bash
cp .env.example .env
# Editar .env con tus valores
```

4. **Inicializar la base de datos**:
```bash
npm run seed
```

5. **Iniciar el servidor**:
```bash
# Producción
npm start

# Desarrollo (con auto-reload)
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

---

## Milestone 1: Scraping de datos

### ¿Qué hemos hecho aquí?

Para empezar hemos creado scripts que nos permiten descargar todos los datos que usamos en la aplicacion de este modo en vez de estar llamando siempre a APIs externas (que pueden caerse o ir lentas), descargamos todo a nuestro servidor y lo servimos desde ahí. Así la app va más rápida y no dependemos de nadie.

### Los scripts que hemos creado

Hemos creado varios scripts en `src/scripts/` para descargar todo esto:

```
src/scripts/
├── fetchLeagues.js      → Descarga logos de las 5 ligas
├── fetchNations.js      → Descarga banderas de países
├── fetchTeams.js        → Descarga escudos de equipos
├── fetchPlayers.js      → Descarga fotos de jugadores (el heavy)
└── fetchAll.js          → Script todo-en-uno (bonus)
```

Todo se guarda en `public/images/` organizado por tipo (leagues, nations, teams, players).

---

### 1. Descargando logos de ligas (fetchLeagues.js)

Lee un archivo `leagues.txt` con 5 líneas (de1, en1, es1, fr1, it1) y descarga el logo de cada liga.

**Codigo:**

```javascript
const fs = require('fs').promises;      // Usamos la versión con promesas
const fsSync = require('fs');           // También necesitamos la versión sync para streams

(async () => {
  // Creamos la carpeta si no existe
  await fs.mkdir(writepath, { recursive: true });
  
  // Leemos el archivo con los nombres de las ligas
  const content = await fs.readFile(path.join(__dirname, '../../leagues.txt'), 'utf8');
  const data = content.split('\n');     // Separamos por líneas
  
  data.forEach((elem, idx) => {
    const url = `https://playfootball.games/media/competitions/${elem}.png`;
    
    fetch(url)
      .then(res => {
        if (res.status === 200) {
          // Aquí usamos streams: los datos van directamente al archivo
          // sin cargar toda la imagen en memoria
          res.body.pipe(fsSync.createWriteStream(`${writepath}${elem}.png`));
        } else {
          console.log(`No encontrado: ${elem}`);
        }
      })
      .catch(err => console.log(err));
  });
})();
```

**¿Por qué usamos `pipe()`?** Porque las imágenes pueden ser grandes. Con `pipe()` los datos van directamente del servidor al disco, byte a byte, sin tener que cargar toda la imagen en la RAM primero.

**Ejecutar:** `node src/scripts/fetchLeagues.js`

---

### 2. Descargando banderas (fetchNations.js)

Este es casi igual que el anterior, pero tiene un detalle importante: algunos países tienen espacios en el nombre.

**La solución: URL Encoding**

```javascript
data.forEach((elem, idx) => {
  const cleanElem = elem.trim();        // Quitamos espacios al principio/final
  if (!cleanElem) return;               // Ignoramos líneas vacías
  
  // Esto convierte "Bosnia and Herzegovina" en "Bosnia%20and%20Herzegovina"
  const encodedNation = encodeURIComponent(cleanElem);
  const url = `https://playfootball.games/media/nations/${encodedNation}.svg`;
  
  fetch(url)
    .then(res => {
      if (res.status === 200) {
        res.body.pipe(fsSync.createWriteStream(`${writepath}${cleanElem}.svg`));
        console.log(`[${idx + 1}]${cleanElem}`);
      } else {
        console.log(`[${idx + 1}]${cleanElem} - no encontrada`);
      }
    })
    .catch(err => console.log(err));
});
```

**¿Qué hace `encodeURIComponent`?** Convierte caracteres especiales (espacios, acentos, etc.) en códigos que se pueden usar en URLs. Los espacios se convierten en `%20`, por ejemplo.

**Resultado:** 102 de 103 banderas descargadas (había una línea vacía que ignoramos) 

---

### 3. Descargando escudos de equipos (fetchTeams.js)

Aquí viene la primera cosa rara: la URL para descargar un escudo no es simplemente el ID del equipo. Hay que hacer un cálculo matemático primero 

```javascript
data.forEach((elem, idx) => {
  const teamId = elem.trim();
  if (!teamId) return;
  
  // Módulo 32
  const directory = teamId % 32;
  
  // Si teamId es 33, directory será 1
  // La URL queda: .../teams/1/33.png
  const url = `https://cdn.sportmonks.com/images/soccer/teams/${directory}/${teamId}.png`;
  
  fetch(url)
    .then(res => {
      if (res.status === 200) {
        res.body.pipe(fsSync.createWriteStream(`${writepath}${teamId}.png`));
      } else {
        console.log(`Equipo ${teamId} no encontrado`);
      }
    })
    .catch(err => console.log(err));
});
```

**¿Por qué módulo 32?** Porque la API organiza las imágenes en 32 carpetas (0 a 31) para no tener miles de archivos en un solo directorio. El operador `%` (módulo) nos da el resto de dividir entre 32. Así:
- `33 % 32 = 1` → va a la carpeta 1
- `64 % 32 = 0` → va a la carpeta 0
- `50 % 32 = 18` → va a la carpeta 18

Con esto podemos descargar todos los escudos correctamente.

---

### 4. Descargando fotos de jugadores (fetchPlayers.js) - El pesado

Aquí tenemos 2038 jugadores. Si intentas descargar todo de golpe, el servidor te bloquea con un error 429 (Too Many Requests).

**La solución: Throttling**

Limitamos las peticiones a 10 por segundo:

```javascript
const REQUESTS_PER_SECOND = 10;
const DELAY_MS = 1000 / REQUESTS_PER_SECOND;  // 100ms entre cada petición

(async () => {
  await fs.mkdir(writepath, { recursive: true });
  
  const content = await fs.readFile(path.join(__dirname, '../../public/json/fullplayers25.json'), 'utf8');
  const players = JSON.parse(content);
  
  console.log(`Descargando ${players.length} imágenes de jugadores con throttling...\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let idx = 0; idx < players.length; idx++) {
    const player = players[idx];
    const playerId = player.id;
    const directory = playerId % 32;  // Mismo truco que con los equipos
    const url = `https://playfootball.games/media/players/${directory}/${playerId}.png`;
    
    // Cada petición espera idx * 100ms
    // La 0 espera 0ms, la 1 espera 100ms, la 2 espera 200ms...
    await new Promise((resolve) => {
      setTimeout(() => {
        fetch(url)
          .then(res => {
            if (res.status === 200) {
              res.body.pipe(fsSync.createWriteStream(`${writepath}${playerId}.png`));
              successCount++;
            } else {
              errorCount++;
            }
            console.log(`[${idx + 1}/${players.length}] ${playerId}`);
            resolve();
          })
          .catch(err => {
            console.log(`Error: ${playerId} - ${err.message}`);
            errorCount++;
            resolve();
          });
      }, idx * DELAY_MS);
    });
  }
  
  console.log(`\n✓ Descarga completada: ${successCount} éxito, ${errorCount} errores`);
})();
```

**¿Cómo funciona el throttling?**
- Usamos `setTimeout()` para retrasar cada petición
- La primera petición sale inmediatamente (0 * 100ms = 0ms)
- La segunda espera 100ms
- La tercera espera 200ms
- Y así...
- Resultado: enviamos 10 peticiones por segundo exacto

**Tiempo estimado:** Unos 3-4 minutos para los 2038 jugadores.

---

### 5. Bonus Track: El script unificado (fetchAll.js)

Después de escribir casi el mismo código 4 veces, pensé: "esto es una mierda, debería ser una sola función". Y eso hice.

```javascript
async function downloadResources(inputFile, outputDir, urlBuilder) {
  await fs.mkdir(outputDir, { recursive: true });
  const content = await fs.readFile(inputFile, 'utf8');
  
  // Si es JSON lo parseamos, si es texto lo separamos por líneas
  let data;
  if (inputFile.endsWith('.json')) {
    data = JSON.parse(content);
  } else {
    data = content.split('\n').filter(line => line.trim() !== '');
  }
  
  console.log(`Descargando ${data.length} recursos...\n`);
  
  //urlBuilder es una función que nos pasan
  // y que sabe cómo construir la URL para cada tipo de recurso
  for (let idx = 0; idx < data.length; idx++) {
    const elem = data[idx];
    const { url, filename } = urlBuilder(elem, idx);  // ¡Llamamos a la función!
    
    await new Promise((resolve) => {
      setTimeout(() => {
        fetch(url)
          .then(res => {
            if (res.status === 200) {
              res.body.pipe(fsSync.createWriteStream(path.join(outputDir, filename)));
              console.log(`[${idx + 1}/${data.length}] ✓ ${filename}`);
            } else {
              console.log(`[${idx + 1}/${data.length}] ✗ ${filename}`);
            }
            resolve();
          })
          .catch(err => {
            console.log(`[${idx + 1}/${data.length}] ✗ ${filename} - ${err.message}`);
            resolve();
          });
      }, idx * DELAY_MS);
    });
  }
}
```

**¿Cómo se usa?**

```javascript
// Para ligas:
await downloadResources(
  'leagues.txt',
  'public/images/leagues/',
  (elem) => ({
    url: `https://playfootball.games/media/competitions/${elem}.png`,
    filename: `${elem}.png`
  })
);

// Para jugadores:
await downloadResources(
  'public/json/fullplayers25.json',
  'public/images/players/',
  (player) => {
    const playerId = player.id;
    const directory = playerId % 32;
    return {
      url: `https://playfootball.games/media/players/${directory}/${playerId}.png`,
      filename: `${playerId}.png`
    };
  }
);
```

**Ejecutar:** `node src/scripts/fetchAll.js leagues` (o nations, teams, players)

---

### Conceptos técnicos que usamos

#### Streams (tuberías)
En vez de descargar toda la imagen a memoria y luego guardarla, usamos `pipe()` para que vaya directamente al disco:
```javascript
res.body.pipe(fsSync.createWriteStream(filepath));
```

#### Async/Await
```javascript
const fs = require('fs').promises;
await fs.mkdir(dir, { recursive: true });
await fs.readFile(file, 'utf8');
```

En vez de callbacks o `.then()`, usamos `await` que es más limpio y fácil de leer. El código espera a que termine la operación antes de continuar, tambien se podria usar las funciones en su version Sync, pero como el codigo original no las usa nosotros tampoco.


---

### Archivos que necesitas tener

Para que los scripts funcionen, necesitas estos archivos en la raíz del proyecto:

1. **leagues.txt** - Bajar de [aquí](https://labur.eus/DmX2t)
2. **nationalities.txt** - Generarlo con:
   ```bash
   jq -er 'map(.nationality) | .[]' fullplayers25.json | Sort-Unique > nationalities.txt
   ```
3. **teamIDs.txt** - Generarlo con:
   ```bash
   jq -r 'map(.teamId) | unique | sort | .[]' fullplayers25.json > teamIDs.txt
   ```
4. **public/json/fullplayers25.json** - Esta en el frontend original.


---

