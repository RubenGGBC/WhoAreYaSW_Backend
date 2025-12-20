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
