# Who Are Ya? - Backend

## Descripción del Proyecto

Este repositorio contiene el backend del proyecto WhoAreYa, desarrollado con Node.js y Express, que gestiona la lógica del juego, los datos de jugadores, las estadísticas y sirve el frontend estático.

<img width="954" height="456" alt="image" src="https://github.com/user-attachments/assets/b7a7e5f3-4a2c-4bda-8177-f430ff4510b3" />

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

**Opción elegida: A - Usar .env directamente**

#### Justificación:
- **Proyecto pequeño**: Al ser un proyecto pequeño con no demasiadas variables de entorno no es necesario preocuparse demasiado por la validación de estas. Tampoco hay demasiados archivos que requieran cargar las variables.
- **Fácil de usar**: La configuración escogida es cómoda y fácil de usar.
- **Ejemplo en .env.example**: Se define un .env.example en la raíz del proyecto, lo que guiará al usuario a crear su .env con rápidez, por lo que será fácil de usar para ellos también.

#### Variables de entorno por definir (.env y .env.example):

```javascript
# Server Configuration
PORT
NODE_ENV

# Database
MONGO_URI 

# Session
SESSION_SECRET 
SESSION_MAX_AGE

# CORS
CORS_ORIGIN

# Game Configuration
SOLUTION_START_DATE

#A partir de aquí, para la milestone 6:

# OAuth Google
GOOGLE_CLIENT_ID 
GOOGLE_CLIENT_SECRET 
GOOGLE_CALLBACK_URL

# OAuth GitHub
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
GITHUB_CALLBACK_URL

# JWT Configuration
JWT_SECRET 
JWT_EXPIRES_IN
JWT_REFRESH_SECRET 
JWT_REFRESH_EXPIRES_IN

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

## Estructura del Proyecto

```
WhoAreYaSW_Backend/
├─ `leagues.txt`
├─ `nationalities.txt`
├─ `package.json`
├─ `README.md`
├─ `server.js`
├─ `teamIDs.txt`
├─ `public/`
│  ├─ `admin/`
│  │  ├─ css/
│  │  │  └─ `admin.css`
│  │  └─ js/
│  │     ├─ `admin-autocomplete.js`
│  │     ├─ `admin-main.js`
│  │     ├─ `api-client.js`
│  │     ├─ `custom-select.js`
│  │     ├─ `player-edit.js`
│  │     └─ `player-form.js`
│  ├─ `auth/`
│  │  ├─ css/
│  │  │  ├─ `auth.css`
│  │  │  └─ `oauth.css`
│  │  └─ js/
│  │     ├─ `login.js`
│  │     └─ `register.js`
│  ├─ images/
│  │  ├─ leagues/
│  │  │  ├─ `…
│  │  ├─ nations/
│  │  │  ├─ …
│  │  ├─ players/
│  │  └─ teams/
│  └─ frontend (parte 1 de de WhoAreYa)
└─ `src/`
│   ├─ `app.js`
│   ├─ config/
│   │  ├─ `multer.js`
│   │  └─ `passport.js`
│   ├─ controllers/
│   │  ├─ `adminController.js`
│   │  ├─ `authController.js`
│   │  ├─ `gameController.js`
│   │  ├─ `oauthController.js`
│   │  └─ `oauthRoutes.js`  
│   ├─ db/
│   │  ├─ `connection.js`
│   │  └─ seeders/
│   │     ├─ `seedPlayers.js`
│   │     └─ `seedSolutions.js`
│   ├─ middlewares/
│   │  └─ `authMiddleware.js`
│   ├─ models/
│   │  ├─ `League.js`
│   │  ├─ `Player.js`
│   │  ├─ `Solution.js`
│   │  ├─ `Stats.js`
│   │  ├─ `Team.js`
│   │  └─ `User.js`
│   ├─ routes/
│   │  ├─ `adminRoutes.js`
│   │  ├─ `authRoutes.js`
│   │  ├─ `gameRoutes.js`
│   │  ├─ `oauthRoutes.js`
│   │  └─ `playerRoutes.js`
│   ├─ scripts/
│   │  ├─ `fetchAll.js`
│   │  ├─ `fetchLeagues.js`
│   │  ├─ `fetchNations.js`
│   │  ├─ `fetchPlayers.js`
│   │  └─ `fetchTeams.js`
│   └─ utils/
│      └─ `jwt.js`
│
└─tests/
│├─ `auth-routes.test.js`
│├─ `auth.test.js`
│├─ `controllers.test.js`
│├─ `debug-auth.test.js`
│├─ `find-auth-routes.test.js`
│├─ `player-model.test.js`
│├─ `setup.js`
│└─ `test-app.js`
│
└─views/
│├─ admin/
││  ├─ `dashboard.ejs`
││  ├─ `edit-player.ejs`
││  └─ `new-player.ejs`│
│├─ auth/
││  ├─ `login.ejs`
││  └─ `register.ejs`
│└─ partials/
│   ├─ `admin-footer.ejs`
│   └─ `admin-header.ejs`
└─WhoIsThisPokemon/
   └─Juego de pokemon (misma estructura que WhoAreYa)       
   
```

## Dependencias del Proyecto

### package.json

```json
{
  "name": "WhoAreYa",
  "version": "1.0.0",
  "description": "",
  "main": "public/index.js",
  "scripts": {
    "test": "cross-env NODE_ENV=test jest --verbose",
    "test:watch": "cross-env NODE_ENV=test jest --watch"
  },
  "private": true,
  "dependencies": {
    "autosuggest-highlight": "^3.3.4",
    "bcryptjs": "^3.0.3",
    "browserify": "^17.0.1",
    "connect-mongo": "^6.0.0",
    "dotenv": "^17.2.3",
    "ejs": "^3.1.10",
    "express": "^5.2.1",
    "express-session": "^1.18.2",
    "express-validator": "^7.3.1",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.0.2",
    "multer": "^2.0.2",
    "node-fetch": "^2.6.1",
    "passport": "^0.7.0",
    "passport-github2": "^0.1.12",
    "passport-google-oauth20": "^2.0.0"
  },
  "devDependencies": {
    "cross-env": "^10.1.0",
    "jest": "^30.2.0",
    "mongodb-memory-server": "^11.0.1",
    "supertest": "^7.1.4"
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
node server.js
```

El servidor estará disponible en `http://localhost:3000` (o en el que se haya configurado en las variables de entorno correspondientes)

---

## Tags:

- [Milestone 0](https://github.com/RubenGGBC/WhoAreYaSW_Backend/releases/tag/backend-milestone0)
- [Milestone 1](https://github.com/RubenGGBC/WhoAreYaSW_Backend/releases/tag/backend-milestone1)
- [Milestone 2](https://github.com/RubenGGBC/WhoAreYaSW_Backend/releases/tag/backend-milestone2)
- [Milestone 3](https://github.com/RubenGGBC/WhoAreYaSW_Backend/releases/tag/backend-milestone3)
- [Milestone 4](https://github.com/RubenGGBC/WhoAreYaSW_Backend/releases/tag/backend-milestone4)
- [Milestone 5](https://github.com/RubenGGBC/WhoAreYaSW_Backend/releases/tag/backend-milestone5)
- [Milestone 6](https://github.com/RubenGGBC/WhoAreYaSW_Backend/releases/tag/backend-milestone6)
- [WhoIsThisPokemon](https://github.com/RubenGGBC/WhoAreYaSW_Backend/releases/tag/backend-WhoIsThisPokemon)

---

## WhoIsThisPokemon

Este es un apartado bonus que el grupo a decidido hacer, ya que en la parte 1 del proyecto (frontend) se decidió realizar la milestone 9. Esta milestone consistía en reconstruir el proyecto WhoAreYa en un juego similar, pero con Pokémons en vez de con jugadores de fútbol. En esta segunda parte (backend) del proyecto, se ha vuelto a reconstruir todo el proyecto entero en un juego de Pokémon en vez de con jugadores de fútbol. 

<img width="886" height="424" alt="image" src="https://github.com/user-attachments/assets/2b589ac0-45c0-4796-ba24-5051bbfd56ed" />

---

### Localización y estructura:

- Todo este segundo juego de Pokémon se ha realizado dentro de la carpeta WhoIsThisPokemon, dentro del directorio raíz.
- La estructura es exactamente la misma que el juego WhoAreYa, es decir, la milestone 0 es exactamente la misma para el juego WhoAreYa que para WhoIsThisPokemon.

---

### Metodología de trabajo:

El juego de Pokémon se ha realizado en paralelo al juego original (WhoAreYa) en una Branch aparte del repositorio. Se ha ido trabajando milestone por milestone, como el juego original de WhoAreYa y se ha intentado replicar la misma lógica en todas ellas con respecto a las milestones del juego original.

---

### Cómo probarlo:

1. **Cambiar al directorio de WhoIsThisPokemon (partiendo del directorio raíz)**:
```bash
cd WhoIsThisPokemon
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
node server.js
```

El servidor estará disponible en `http://localhost:3001` (o en el que se haya configurado en las variables de entorno correspondientes)

---

Para más información sobre WhoIsThisPokemon, leer su [README](https://github.com/RubenGGBC/WhoAreYaSW_Backend/blob/master/WhoIsThisPokemon/README.md)

---
