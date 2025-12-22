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
    const { url, filename } = urlBuilder(elem, idx);
    
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

## Milestone 2: MongoDB - Configuración y Modelos

### ¿Qué hemos hecho?

Conectamos la app a MongoDB y creamos los esquemas (moldes) para nuestros datos. Así, MongoDB sabe exactamente cómo deben verse los jugadores, equipos y ligas.

### Archivos creados

```
src/
├── db/
│   ├── connection.js           ← Conexión a MongoDB
│   └── seeders/
│       └── seedPlayers.js      ← Script para llenar la BD
│
└── models/
    ├── League.js               ← Esquema de ligas
    ├── Team.js                 ← Esquema de equipos
    └── Player.js               ← Esquema de jugadores
```

### 1. Conexión a MongoDB (src/db/connection.js)

Este archivo conecta tu app con MongoDB usando Mongoose.

```javascript
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/whoareya';

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB:', MONGO_URI);
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = { connectDB, mongoose };
```

**¿Qué hace?**
- `mongoose.connect()` → Se conecta a MongoDB
- Si falla → `process.exit(1)` mata el servidor (no queremos un app sin BD)
- Si funciona → Console dice que está conectado

---

### 2. Esquema de League (src/models/League.js)

Define cómo se ve una **liga** en la BD.

```javascript
const { mongoose } = require('../db/connection');

const leagueSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    minlength: 2
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  country: String,
  flagUrl: String
});

module.exports = mongoose.model('League', leagueSchema);
```

**Validaciones:**
- `id` → Número único (no puede haber dos con el mismo)
- `name` → String obligatorio, mínimo 2 caracteres
- `code` → Código único (ej: 'de1', 'en1')
- `country` y `flagUrl` → Opcionales

---

### 3. Esquema de Team (src/models/Team.js)

Define cómo se ve un **equipo** en la BD.

```javascript
const { mongoose } = require('../db/connection');

const teamSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    minlength: 2
  },
  leagueId: {
    type: Number,
    required: true
  },
  logoUrl: String,
  country: String,
  stadium: String
});

module.exports = mongoose.model('Team', teamSchema);
```

**Validaciones:**
- `id` → Número único
- `name` → String obligatorio, mínimo 2 caracteres
- `leagueId` → Número obligatorio (relaciona el equipo con una liga)
- Resto → Opcionales

---

### 4. Esquema de Player (src/models/Player.js)

Define cómo se ve un **jugador** en la BD.

```javascript
const { mongoose } = require('../db/connection');

const playerSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    minlength: 2
  },
  birthDate: Date,
  nationality: String,
  teamId: Number,
  leagueId: Number,
  position: {
    type: String,
    enum: ['DF', 'MF', 'FW', 'GK'],
    required: true
  },
  number: Number,
  imageUrl: String,


module.exports = mongoose.model('Player', playerSchema);
```

**Validaciones**
- `position` → Usa `enum` para limitar a solo 4 valores: DF (defensa), MF (mediocampo), FW (delantero), GK (portero)
- Si intentas guardar `position: "INVALID"` → MongoDB rechaza 
- Solo acepta los 4 valores válidos 

---

### 5. Script Seed (src/db/seeders/seedPlayers.js)

Este script llena la BD con los 2038 jugadores que descargamos en el Milestone 1.

**¿Qué hace?**
```javascript
1. Conecta a MongoDB
2. Borra datos viejos (si existen)
3. Lee el archivo fullplayers25.json
4. Extrae ligas y equipos únicos
5. Inserta todo en la BD
   - 4 ligas
   - 78 equipos
   - 2038 jugadores
```

**Ejecutar:**
```bash
 node src/db/seeders/seedPlayers.js
```

**Output esperado:**
```
Conectado a MongoDB: mongodb://localhost:27017/whoareya
Insertando 4 ligas...
Insertando 78 equipos...
Insertando 2038 jugadores...
Base de datos poblada correctamente
   - 4 ligas
   - 78 equipos
   - 2038 jugadores
```

---

### 6. Actualización de server.js

Para que todo funcione, `server.js` debe llamar a `connectDB()`:

```javascript
const app = require('./src/app');
const { connectDB } = require('./src/db/connection');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error iniciando servidor:', error.message);
    process.exit(1);
  }
}

startServer();
```

---

## Milestone 3: Gestión de usuarios - Autentificación y Autorización

### ¿Qué hemos hecho?

En este milestone implementamos un sistema completo de autentificación y autorización. Permite que los usuarios se registren, inicien sesión, y acceda a recursos protegidos según su rol.

**Cambios importantes:**
- Los usuarios se pueden registrar y hacer login/logout
- Las contraseñas se guardan hasheadas (seguridad)
- Las sesiones se almacenan en MongoDB (persisten entre reinicios)
- Hay dos roles: `admin` y `user`
- El **primer usuario que se registra automáticamente es admin**
- Tenemos middlewares para proteger rutas (solo usuarios autenticados, solo admins, etc.)

---

### 1. Modelo User (src/models/User.js)

Define cómo se ve un **usuario** en la BD.

```javascript
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
```

**Validaciones:**
- `name` y `lastName` → Strings obligatorios, mínimo 2 caracteres
- `email` → Único, validado con regex para que sea un email válido
- `password` → Mínimo 8 caracteres, se hashea automáticamente antes de guardar
- `role` → Solo puede ser `'admin'` o `'user'`

Cuando el usuario registra su contraseña "password123", no la guardamos tal cual. En su lugar:
1. Se genera un "salt" (número aleatorio) - línea `const salt = await bcrypt.genSalt(10)`
2. Se hashea la contraseña combinada con el salt - línea `await bcrypt.hash(this.password, salt)`
3. Se guarda el hash en la BD (la contraseña original se pierde)

Cuando el usuario intenta login, usamos `comparePassword()` para comparar la contraseña que envía con el hash guardado. Si coinciden, el login es válido.

De esta manera podemos ocultar las contraseñas de los usuarios en la BD y solo se ve la contraseña hasheada

---

### 2. Controlador de Autentificación (src/controllers/authController.js)

El controlador maneja 4 operaciones:

#### `register(req, res)`
Crea un nuevo usuario. Verifica que el email no exista y que sea el primero si es admin.

```javascript
POST /auth/register
Body: {
  name: "Juan",
  lastName: "Pérez",
  email: "juan@example.com",
  password: "password123",
  confirmPassword: "password123"
}
```

**Validaciones:**
1. El email no debe existir
2. Las dos contraseñas deben coincidir
3. Se valida nombre, apellido, email, contraseña (en las rutas, ver paso 3)

**Respuesta exitosa (201):**
```javascript
{
  success: true,
  data: {
    id: ObjectId,
    name: "Juan",
    lastName: "Pérez",
    email: "juan@example.com",
    role: "admin" // o "user"
  },
  message: "Primer usuario registrado como admin"
}
```

#### `login(req, res)`
Verifica email y contraseña, crea una sesión.

```javascript
POST /auth/login
Body: {
  email: "juan@example.com",
  password: "password123"
}
```

**¿Qué pasa internamente?**
1. Se busca el usuario por email
2. Se compara la contraseña con `comparePassword()`
3. Si es correcta, se crea una sesión en MongoDB
4. El navegador recibe una cookie `connect.sid` con el ID de la sesión

**Respuesta exitosa (200):**
```javascript
{
  success: true,
  data: {
    id: ObjectId,
    name: "Juan",
    lastName: "Pérez",
    email: "juan@example.com",
    role: "admin"
  },
  message: "Sesión iniciada exitosamente"
}
```

#### `logout(req, res)`
Destruye la sesión en MongoDB y borra la cookie.

```javascript
POST /auth/logout
```

Requiere estar autenticado (tener sesión activa).

#### `getCurrentUser(req, res)`
Retorna quién eres si estás logueado.

```javascript
GET /auth/me
```

Requiere estar autenticado. Respuesta:
```javascript
{
  success: true,
  data: {
    userId: ObjectId,
    role: "admin" // o "user"
  }
}
```

---

### 3. Rutas de Autentificación con Validación (src/routes/authRoutes.js)

Las rutas usan `express-validator` para validar los datos antes de llegar al controlador.

**Rutas públicas:**
```javascript
POST /auth/register    // Crear cuenta
POST /auth/login       // Iniciar sesión
```

**Rutas protegidas:**
```javascript
POST /auth/logout      // Requiere sesión activa
GET /auth/me           // Requiere sesión activa
```

**Validaciones en /register:**
- `name`: Mínimo 2 caracteres
- `lastName`: Mínimo 2 caracteres
- `email`: Debe ser un email válido (usando `.isEmail()`)
- `password`: Mínimo 8 caracteres
- `confirmPassword`: Debe coincidir exactamente con `password`

**Validaciones en /login:**
- `email`: Debe ser email válido
- `password`: Es obligatorio

Si hay errores de validación, se retorna **400**:
```javascript
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Datos de entrada inválidos',
    details: [
      {
        value: "juan",
        msg: "El nombre debe tener al menos 2 caracteres",
        param: "name",
        location: "body"
      }
    ]
  }
}
```

---

### 4. Middlewares de Autentificación (src/middlewares/authMiddleware.js)

Dos middlewares que protegen las rutas:

#### `isAuthenticated`
Verifica que exista sesión activa.

```javascript
// Uso en una ruta
router.post('/logout', isAuthenticated, authController.logout);

// Si no está autenticado, retorna 401:
{
  success: false,
  error: {
    code: 'NOT_AUTHENTICATED',
    message: 'Debe iniciar sesión'
  }
}
```

#### `isAdmin`
Verifica que el rol sea `'admin'`. Se usa junto con `isAuthenticated`.

```javascript
// Uso: primero autentificarse, luego verificar que es admin
router.post('/admin/players', isAuthenticated, isAdmin, createPlayer);

// Si no es admin, retorna 403:
{
  success: false,
  error: {
    code: 'FORBIDDEN',
    message: 'Acceso solo para administradores'
  }
}
```

---

### 5. Sesiones con MongoStore (src/app.js)

Las sesiones se configuran con MongoStore para que persistan en MongoDB:

```javascript
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.SESSION_SECRET || '9B906D89BCBA4328-8A48923B899AFC0C-83D507C9E55D4A5B-ACCEE54828089617',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/whoareya',
    ttl: 24 * 60 * 60
  })
}));
```

**Ventajas de MongoStore:**
- Las sesiones se guardan en MongoDB
- Persisten si reinicia el servidor
- Funcionan con múltiples servidores
- El usuario sigue logueado tras un restart
- Sin MongoStore, las sesiones se pierden al reiniciar

**Variables de entorno necesarias:**

```bash
MONGO_URI=mongodb://localhost:27017/whoareya
SESSION_SECRET=9B906D89BCBA4328-8A48923B899AFC0C-83D507C9E55D4A5B-ACCEE54828089617
```

---

### 6. Sistema de Roles

**Dos roles:**
- `admin` → Acceso a CRUD de jugadores, panel de administración, etc.
- `user` → Solo lectura de datos públicos

**Regla especial:**
El primer usuario que se registra automáticamente es `admin`. Los siguientes son `user`.

En el controlador:
```javascript
const userCount = await User.countDocuments();
const role = userCount === 0 ? 'admin' : 'user';
```

En futuras ampliaciones (Milestone 5) habrá rutas de admin para cambiar roles.

---

### 7. Archivos Creados/Modificados

```
src/
├── models/
│   └── User.js                          (Creado)
│
├── controllers/
│   └── authController.js                (Modificado - con validaciones)
│
├── routes/
│   └── authRoutes.js                    (Modificado - con express-validator)
│
├── middlewares/
│   └── authMiddleware.js                (Creado)
│
└── app.js                               (Modificado - session + authRoutes)

package.json                             (Modificado - dependencias)
```

---



---

## Milestone 4: API REST - CRUD de Jugadores

### ¿Qué hemos hecho?

En este milestone implementamos una API REST completa para gestionar jugadores. El backend ahora sirve datos desde la BD en lugar de archivos JSON estáticos.

**Cambios importantes:**
- 7 endpoints REST para operaciones CRUD
- Rutas públicas para lectura (GET)
- Rutas protegidas para escritura (POST, PUT, DELETE) - solo admin
- Paginación en listados
- Validación de datos y manejo de errores consistente
- Endpoints específicos para el juego (solución del día)
- Separación clara entre controladores (lógica) y rutas (HTTP)

---

### 1. Endpoints de la API

#### Rutas públicas (sin autenticación)

**GET /api/players**
Obtiene lista paginada de jugadores.

Query parameters:
- `page` (default: 1) - Número de página
- `limit` (default: 10) - Jugadores por página

Ejemplo: `GET /api/players?page=1&limit=10`

**GET /api/players/:id**
Obtiene un jugador específico por su ID de MongoDB.

**GET /api/teams**
Obtiene lista de todos los equipos.

**GET /api/leagues**
Obtiene lista de todas las ligas.

**GET /api/game/current**
Obtiene el número del juego actual basado en la fecha actual.

Respuesta:
```javascript
{
  success: true,
  data: {
    gameNumber: 347,
    date: "2025-12-22T23:05:42.929Z"
  }
}
```

**GET /api/game/:gameNumber**
Obtiene información de un juego específico por número.

Ejemplo: `GET /api/game/1`

Respuesta:
```javascript
{
  success: true,
  data: {
    gameNumber: 1,
    date: "2025-01-10T00:00:00.000Z",
    hasSolution: true
  }
}
```

**GET /api/solution/:gameNumber**
Obtiene la solución del día (el jugador del día) para un juego específico.

Ejemplo: `GET /api/solution/1`

Respuesta:
```javascript
{
  success: true,
  data: {
    playerId: 27440826,
    _id: "694723512c19de3530d59c1e"
  }
}
```

---

#### Rutas protegidas (requieren admin)

**POST /api/players**
Crea un nuevo jugador. Solo administrador.

**PUT /api/players/:id**
Actualiza un jugador existente. Solo administrador.

**DELETE /api/players/:id**
Elimina un jugador. Solo administrador.

---

### 2. Arquitectura: Controllers vs Routes

**Controladores (playerController.js):**
- Contienen la lógica del negocio
- Consultan la BD
- Procesan datos
- Devuelven respuestas JSON

**Rutas (playerRoutes.js):**
- Definen las URLs
- Especifican el método HTTP (GET, POST, etc)
- Llaman a los controladores
- Aplican middlewares de autenticación/autorización

Esto nos permite mantener un código más limpio, organizado y escalable.

---

### 3. Detalles de Endpoints CRUD

#### GET /api/players - Listar con paginación

Retorna jugadores con información de paginación:

Respuesta exitosa (200):
```javascript
{
  success: true,
  data: [
    {
      _id: "507f1f77bcf86cd799439011",
      id: 12345,
      name: "Lionel Messi",
      position: "FW",
      birthDate: "1987-06-24",
      nationality: "Argentina",
      teamId: 2030,
      leagueId: 8,
      imageUrl: "/images/players/12345.png"
    },
    ...
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 2038,
    pages: 204
  }
}
```

Con 2038 jugadores y limit 10 → 204 páginas totales.

#### GET /api/players/:id - Obtener jugador por ID

Ejemplo: `GET /api/players/507f1f77bcf86cd799439011`

Respuesta exitosa (200):
```javascript
{
  success: true,
  data: {
    _id: "507f1f77bcf86cd799439011",
    id: 12345,
    name: "Lionel Messi",
    position: "FW",
    birthDate: "1987-06-24T00:00:00.000Z",
    nationality: "Argentina",
    teamId: 2030,
    leagueId: 8,
    number: 10,
    imageUrl: "/images/players/12345.png"
  }
}
```

Si no existe (404):
```javascript
{
  success: false,
  error: {
    code: 'PLAYER_NOT_FOUND',
    message: 'Jugador no encontrado'
  }
}
```

#### GET /api/teams - Listar todos los equipos

Respuesta:
```javascript
{
  success: true,
  data: [
    {
      _id: "507f1f77bcf86cd799439012",
      id: 2030,
      name: "FC Barcelona",
      leagueId: 8,
      logoUrl: "/images/teams/2030.png",
      country: "Spain",
      stadium: "Camp Nou"
    },
    ...
  ]
}
```

#### GET /api/leagues - Listar todas las ligas

Respuesta:
```javascript
{
  success: true,
  data: [
    {
      _id: "507f1f77bcf86cd799439013",
      id: 8,
      name: "La Liga",
      code: "es1",
      country: "Spain",
      flagUrl: "/images/leagues/es1.png"
    },
    ...
  ]
}
```

#### POST /api/players - Crear jugador (Admin)

Header: Cookie con sesión de admin

Body:
```javascript
{
  id: 99999,
  name: "Cristiano Ronaldo",
  position: "FW",
  birthDate: "1985-02-05",
  nationality: "Portugal",
  teamId: 236,
  leagueId: 8,
  number: 7,
  imageUrl: "/images/players/99999.png"
}
```

Respuesta exitosa (201):
```javascript
{
  success: true,
  data: {
    _id: "507f1f77bcf86cd799439014",
    id: 99999,
    name: "Cristiano Ronaldo",
    position: "FW",
    ...
  },
  message: "Jugador creado exitosamente"
}
```

Si ID duplicado (400):
```javascript
{
  success: false,
  error: {
    code: 'DUPLICATE_ID',
    message: 'Ya existe un jugador con ese ID'
  }
}
```

Si no es admin (403):
```javascript
{
  success: false,
  error: {
    code: 'FORBIDDEN',
    message: 'Acceso solo para administradores'
  }
}
```

#### PUT /api/players/:id - Actualizar jugador (Admin)

Header: Cookie con sesión de admin

Body (campos opcionales):
```javascript
{
  name: "Cristiano Ronaldo",
  number: 7,
  position: "FW"
}
```

Respuesta exitosa (200):
```javascript
{
  success: true,
  data: {
    _id: "507f1f77bcf86cd799439014",
    id: 99999,
    name: "Cristiano Ronaldo",
    number: 7,
    ...
  },
  message: "Jugador actualizado exitosamente"
}
```

#### DELETE /api/players/:id - Eliminar jugador (Admin)

Header: Cookie con sesión de admin

Respuesta exitosa (200):
```javascript
{
  success: true,
  message: 'Jugador eliminado exitosamente'
}
```

---

### 4. Endpoints del Juego

#### GET /api/game/current - Número de juego actual

Calcula automáticamente basándose en la fecha actual y SOLUTION_START_DATE.

Respuesta:
```javascript
{
  success: true,
  data: {
    gameNumber: 347,
    date: "2025-12-22T23:05:42.929Z"
  }
}
```

La fórmula es:
```javascript
const diffDays = Math.floor((now - SOLUTION_START_DATE) / (1000 * 60 * 60 * 24));
const gameNumber = diffDays + 1;
```

#### GET /api/game/:gameNumber - Información del juego

Ejemplo: `GET /api/game/100`

Respuesta:
```javascript
{
  success: true,
  data: {
    gameNumber: 100,
    date: "2025-04-19T00:00:00Z",
    hasSolution: true
  }
}
```

#### GET /api/solution/:gameNumber - Solución del día

Obtiene el jugador que es la solución para un día específico.

Ejemplo: `GET /api/solution/100`

Respuesta:
```javascript
{
  success: true,
  data: {
    playerId: 185023,
    _id: "694723512c19de3530d5a1f5"
  }
}
```

---

### 5. Paginación en detalle

La paginación se implementa así:

```javascript
const page = parseInt(req.query.page) || 1;      // Página actual (default 1)
const limit = parseInt(req.query.limit) || 10;   // Items por página (default 10)
const skip = (page - 1) * limit;                 // Cuántos documentos saltar

const players = await Player.find()
  .skip(skip)
  .limit(limit)
  .lean();
```

**Ejemplos:**
- `GET /api/players?page=1&limit=10` → Jugadores 1-10
- `GET /api/players?page=2&limit=10` → Jugadores 11-20
- `GET /api/players?page=3&limit=20` → Jugadores 41-60

---

### 6. Validaciones

**En creación de jugador:**
- ID debe ser único
- Position debe ser: DF, MF, FW o GK
- Name es obligatorio
- Requiere autenticación + rol admin

**En actualización:**
- Si no existe el jugador → 404
- Solo se actualizan campos que vienen en el body
- Requiere autenticación + rol admin

**En eliminación:**
- Si no existe → 404
- Requiere autenticación + rol admin

**En GET:**
- Solo validación de formato de ID (MongoDB ObjectId)
- Sin autenticación requerida

---

### 7. Integración con Frontend (loaders.js)

El archivo `public/js/loaders.js` ha sido actualizado para consumir la API:

```javascript
export { fetchJSON, fetchPlayer, fetchSolution };

const API_URL = 'http://localhost:3000/api';

async function fetchJSON(what) {
    let endpoint;

    if (what === 'fullplayers25') {
        endpoint = `${API_URL}/players`;
    } else if (what === 'solution25') {
        // Obtener el número del juego actual
        const gameResponse = await fetch(`${API_URL}/game/current`);
        const gameData = await gameResponse.json();
        const gameNumber = gameData.data.gameNumber;
        endpoint = `${API_URL}/solution/${gameNumber}`;
    }

    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

async function fetchPlayer(playerId) {
    const response = await fetch(`${API_URL}/players/${playerId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

async function fetchSolution(gameNumber) {
    const response = await fetch(`${API_URL}/solution/${gameNumber}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}
```

**Flujo de uso:**
1. Frontend llama `fetchJSON('fullplayers25')` → Backend devueklve array de jugadores desde BD
2. Frontend llama `fetchJSON('solution25')` → Obtiene gameNumber actual → Obtiene solución del día
3. Frontend llama `fetchPlayer(playerId)` → Obtiene detalles de un jugador para comparar

---

### 8. Testing con curl

```bash
# Listar jugadores (página 1, 10 items)
curl http://localhost:3000/api/players?page=1&limit=10

# Obtener un jugador por ID
curl http://localhost:3000/api/players/507f1f77bcf86cd799439011

# Listar equipos
curl http://localhost:3000/api/teams

# Listar ligas
curl http://localhost:3000/api/leagues

# Obtener número de juego actual
curl http://localhost:3000/api/game/current

# Obtener información del juego 1
curl http://localhost:3000/api/game/1

# Obtener solución del día 1
curl http://localhost:3000/api/solution/1

# Crear jugador (requiere estar logeado como admin)
curl -X POST http://localhost:3000/api/players \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "id": 99999,
    "name": "Test Player",
    "position": "FW",
    "birthDate": "1990-01-01",
    "nationality": "Spain",
    "teamId": 2030,
    "leagueId": 8
  }'

# Actualizar jugador
curl -X PUT http://localhost:3000/api/players/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Updated Name",
    "number": 10
  }'

# Eliminar jugador
curl -X DELETE http://localhost:3000/api/players/507f1f77bcf86cd799439011 \
  -b cookies.txt
```

---

### 9. Consideraciones de implementación

**Por qué GET /players no requiere autenticación:**
- Las rutas del juego no requieren login
- El frontend accede libremente a GET /players, GET /players/:id y GET /solution/:gameNumber
- Sin estas rutas públicas, el juego no funcionaría

**POST/PUT/DELETE requieren admin:**
- Solo los administradores pueden modificar datos
- El juego es solo lectura para usuarios normales
- Las operaciones de escritura están protegidas

**Variables de entorno necesarias:**
```bash
MONGO_URI=mongodb://localhost:27017/whoareya
SESSION_SECRET=9B906D89BCBA4328-8A48923B899AFC0C-83D507C9E55D4A5B-ACCEE54828089617
SOLUTION_START_DATE=2025-01-10
```

---

### 10. Modelo Solution

Define cómo se ve una **solución** en la BD (el jugador del día).

```javascript
const SolutionSchema = new mongoose.Schema({
  gameNumber: {
    type: Number,
    required: true,
    unique: true
  },
  playerId: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});
```

**Campos:**
- `gameNumber` → Número único del juego (1, 2, 3, ...)
- `playerId` → ID del jugador que es la solución
- `date` → Fecha correspondiente al juego

---

### 3. Seeding de Soluciones

Se creó el script `seedSolutions.js` que:
1. Crea una solución para cada jugador en la BD
2. Asigna un número de juego (gameNumber)
3. Calcula automáticamente la fecha basada en SOLUTION_START_DATE
4. Los jugadores se asignan secuencialmente (día 1 = jugador 1, día 2 = jugador 2, etc.)

**Ejecutar:**
```bash
node src/db/seeders/seedPlayers.js    # Primero los jugadores
node src/db/seeders/seedSolutions.js  # Luego las soluciones
```

O en un comando:
```bash
node src/db/seeders/seedPlayers.js && node src/db/seeders/seedSolutions.js
```

---

### 11. Archivos Creados/Modificados

```
src/
├── controllers/
│   ├── playerController.js        (Completado - 7 funciones CRUD)
│   │   ├── getPlayers()           - Listar jugadores con paginación
│   │   ├── getPlayersById()       - Obtener jugador por ID
│   │   ├── createPlayer()         - Crear nuevo jugador (admin)
│   │   ├── updatePlayer()         - Actualizar jugador (admin)
│   │   ├── deletePlayer()         - Eliminar jugador (admin)
│   │   ├── getTeams()             - Listar todos los equipos
│   │   └── getLeagues()           - Listar todas las ligas
│   │
│   └── gameController.js          (Creado - endpoints de solución)
│       ├── getCurrentGameNumber()  - Obtener número de juego actual
│       ├── getSolution()           - Obtener solución del día
│       └── getGameInfo()           - Obtener información del juego
│
├── routes/
│   ├── playerRoutes.js            (Completado)
│   │   ├── GET /players           - Público
│   │   ├── GET /players/:id       - Público
│   │   ├── GET /teams             - Público
│   │   ├── GET /leagues           - Público
│   │   ├── POST /players          - Admin
│   │   ├── PUT /players/:id       - Admin
│   │   └── DELETE /players/:id    - Admin
│   │
│   └── gameRoutes.js              (Creado)
│       ├── GET /game/current      - Público
│       ├── GET /game/:gameNumber  - Público
│       └── GET /solution/:gameNumber - Público
│
├── models/
│   └── Solution.js                (Completado)
│       └── SolutionSchema         - Modelo para soluciones del día
│
├── db/seeders/
│   └── seedSolutions.js           (Creado)
│       └── seedSolutions()        - Puebla BD con 2038 soluciones
│
└── app.js                         (Modificado)
    ├── Importa gameRoutes
    ├── Registra playerRoutes en /api
    └── Registra gameRoutes en /api

public/
└── js/
    └── loaders.js                 (Modificado)
        ├── fetchJSON()            - Ahora usa API en lugar de archivos
        ├── fetchPlayer()          - Nueva función para obtener jugador
        └── fetchSolution()        - Nueva función para obtener solución

package.json                       (Sin cambios)
```

---



