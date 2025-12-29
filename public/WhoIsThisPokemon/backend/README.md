# Who Is This Pokemon? - Backend

Backend independiente para la aplicación "Who Is This Pokemon?", desarrollado con Node.js y Express.

---

## Milestone 0: Definición de Arquitectura

### 1. Estructura del Proyecto

**Opción elegida: C - Estructura Híbrida**

Similar a la del proyecto Who Are Ya?, mantenemos:
- Frontend en `../` (html, js, json)
- Backend en `backend/` (node/express)
- Carpeta de datos JSON compartida

#### Justificación:
- Claridad: Frontend y backend separados físicamente
- Escalabilidad: Backend puede crecer independientemente
- Reutilización: Mismo patrón que Who Are Ya?
- Mantenibilidad: Estructura conocida y probada

---

### 2. Punto de Entrada del Servidor

**Opción elegida: B - server.js**

Archivo único `backend/server.js` que:
- Carga variables de entorno (.env)
- Conecta a MongoDB
- Importa app.js
- Inicia el servidor en puerto configurable

#### Justificación:
- Simplicidad: Un único punto de entrada claro
- Coherencia: Mismo patrón que el backend principal

---

### 3. Organización de Carpetas

**Opción elegida: A - Por tipo**

```
backend/
├── src/
│   ├── app.js
│   ├── config/
│   │   └── index.js
│   ├── controllers/
│   │   ├── pokemonController.js
│   │   └── pokemonGameController.js
│   ├── models/
│   │   ├── Pokemon.js
│   │   └── PokemonSolution.js
│   ├── routes/
│   │   ├── pokemonRoutes.js
│   │   └── pokemonGameRoutes.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── db/
│   │   ├── connection.js
│   │   └── seeders/
│   │       ├── seedPokemon.js
│   │       └── seedSolutions.js
│   └── scripts/
│       └── fetchPokemonImages.js
├── server.js
├── .env.example
├── .gitignore
└── package.json
```

#### Justificación:
- Claridad: Todos los modelos juntos, todos los controladores juntos
- Proyecto pequeño-medio: Organización por tipo es suficiente
- Mantenibilidad: Fácil localizar archivos

---

### 4. Gestión de Configuración

**Opción elegida: B - Configuración centralizada**

Archivo `src/config/index.js` que:
1. Carga variables desde `.env`
2. Las valida (tipo, presencia)
3. Da valores por defecto si faltan
4. Expone un único objeto config

#### Variables de entorno necesarias:

```bash
# Servidor
PORT=3001
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/pokemon

# Autenticación
SESSION_SECRET=tu-secret-aqui

# Juego
POKEMON_SOLUTION_START_DATE=2025-01-10
```

#### Justificación:
- Seguridad: Validación centralizada
- Documentación: El archivo de config documenta qué necesita la app
- Prevención de errores: Fallar rápido si falta configuración

---

### 5. Especificación: Rutas del Sistema

#### Rutas de API Pokemon

| Tipo | Método | Endpoint | Descripción | Autorización |
|------|--------|----------|-------------|--------------|
| API | GET | `/api/pokemon` | Obtener lista de pokémon (paginado) | Pública |
| API | GET | `/api/pokemon/:id` | Obtener pokémon específico | Pública |
| API | POST | `/api/pokemon` | Crear nuevo pokémon | Admin |
| API | PUT | `/api/pokemon/:id` | Actualizar pokémon | Admin |
| API | DELETE | `/api/pokemon/:id` | Eliminar pokémon | Admin |

#### Rutas de Juego Pokemon

| Tipo | Método | Endpoint | Descripción | Autorización |
|------|--------|----------|-------------|--------------|
| API | GET | `/api/game/current` | Obtener número del juego actual | Pública |
| API | GET | `/api/game/:gameNumber` | Obtener info del juego | Pública |
| API | GET | `/api/solution/:gameNumber` | Obtener solución del día | Pública |

#### Rutas de Autenticación

| Tipo | Método | Endpoint | Descripción | Autorización |
|------|--------|----------|-------------|--------------|
| API | POST | `/auth/register` | Registrar usuario | Pública |
| API | POST | `/auth/login` | Iniciar sesión | Pública |
| API | POST | `/auth/logout` | Cerrar sesión | Autenticada |
| API | GET | `/auth/me` | Obtener usuario actual | Autenticada |

---

### 6. Base de Datos

**MongoDB con Mongoose**

#### Modelos a crear:

1. **Pokemon**
   - pokemonId: Number (unique)
   - pokemonName: String
   - type1: String
   - type2: String (opcional)
   - weight: Number
   - imageUrl: String (opcional)

2. **PokemonSolution**
   - gameNumber: Number (unique)
   - pokemonId: Number
   - date: Date

3. **User** (reutilizado de Who Are Ya?)
   - name, lastName, email, password, role

---

### 7. Sistema de Autenticación

**Reutilizado del proyecto principal:**
- Uso de bcrypt para contraseñas
- Sesiones en MongoDB
- Roles: admin, user
- Middleware de autenticación

---

### 8. Estructura Provisional del Proyecto

```
public/WhoIsThisPokemon/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   │   └── index.js
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── db/
│   │   │   └── seeders/
│   │   └── scripts/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── js/
│   ├── loaders.js (a actualizar)
│   ├── main.js
│   └── ...
│
├── json/
│   ├── pokedex-1-1000.json (datos base)
│   └── pokemonSolutions.json
│
└── index.html
```

---

### 9. Dependencias del Proyecto

#### Principales:
- express (v5.2.1) - Framework web
- mongoose (v9.0.2) - ODM para MongoDB
- bcryptjs (v3.0.3) - Hash de contraseñas
- express-session (v1.18.2) - Gestión de sesiones
- connect-mongo (v6.0.0) - Store de sesiones en MongoDB
- dotenv (v17.2.3) - Variables de entorno
- node-fetch (v2.6.1) - HTTP requests (descargar imágenes)

---

### 10. Instalación Inicial

```bash
cd public/WhoIsThisPokemon/backend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env
# Editar .env con valores reales

# MongoDB debe estar corriendo
mongod

# Poblar BD
npm run seed

# Iniciar servidor
npm start
# O en desarrollo:
npm run dev
```

El servidor estará disponible en `http://localhost:3001` (por defecto)

---

---

## Milestone 1: Scraping de Imágenes de Pokémon

### ¿Qué hemos hecho?

Creamos un script que descarga automáticamente las 1000 imágenes de pokémon desde PokeAPI (GitHub raw content) y las almacena localmente en `public/images/pokemon/`. Esto permite servir las imágenes desde nuestro servidor en lugar de depender de URLs externas.

### El Script: fetchPokemonImages.js

Ubicación: `src/scripts/fetchPokemonImages.js`

**¿Qué hace?**

```javascript
1. Lee el archivo pokedex-1-1000.json (1000 pokémon)
2. Para cada pokémon:
   - Construye URL de PokeAPI
   - Descarga la imagen con throttling (10 request/segundo)
   - La guarda como {pokemonId}.png
3. Reporta progreso cada 100 pokémon
4. Resumen final: éxito/errores
```

### Conceptos Técnicos

#### Streams (Tuberías)

En lugar de descargar toda la imagen a memoria, usamos `pipe()` para escribir directamente al disco:

```javascript
res.body.pipe(fsSync.createWriteStream(path.join(imagesPath, `${pokemonId}.png`)));
```

**Ventaja:** Las imágenes pueden ser grandes. Con `pipe()` los datos van directamente del servidor al disco, byte a byte, sin cargar nada en RAM.

#### Throttling

Limitamos las peticiones a 10 por segundo para no sobrecargar PokeAPI:

```javascript
const REQUESTS_PER_SECOND = 10;
const DELAY_MS = 1000 / REQUESTS_PER_SECOND;  // 100ms entre peticiones

// Cada petición espera idx * 100ms
setTimeout(() => {
  fetch(url)...
}, idx * DELAY_MS);
```

**¿Por qué?** PokeAPI puede rechazar con error 429 (Too Many Requests) si enviamos muchas peticiones a la vez.

#### URL de PokeAPI

```
https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/{pokemonId}.png
```

Ejemplo:
- Pokémon ID 1 (Bulbasaur): `.../pokemon/other/official-artwork/1.png`
- Pokémon ID 25 (Pikachu): `.../pokemon/other/official-artwork/25.png`

### Ejecución

```bash
# Entrar a carpeta backend
cd public/WhoIsThisPokemon/backend

# Instalar dependencias (si no lo has hecho)
npm install

# Ejecutar script
npm run fetch-images

# O directamente:
node src/scripts/fetchPokemonImages.js
```

### Resultado Esperado

```
Carpeta de imágenes lista: .../public/WhoIsThisPokemon/images/pokemon
Descargando 1000 imágenes de pokémon con throttling...

[100/1000] 100 - voltorb ✓
[200/1000] 200 - exeggcute ✓
[300/1000] 300 - wailord ✓
...
[1000/1000] 1000 - mew ✓

Descarga completada:
✓ 1000 imágenes descargadas
✗ 0 errores
Total: 1000 pokémon
```

**Tiempo estimado:** 100-120 segundos (1000 pokémon ÷ 10 por segundo)

### Estructura de Imágenes Descargadas

```
public/WhoIsThisPokemon/images/pokemon/
├── 1.png      (Bulbasaur)
├── 2.png      (Ivysaur)
├── 3.png      (Venusaur)
...
├── 25.png     (Pikachu)
...
└── 1000.png   (Mew)
```

Total: 1000 archivos PNG

---

## Milestone 2: Modelos MongoDB y Seeders

### ¿Qué hemos hecho?

Creamos dos modelos de datos (Pokemon y PokemonSolution) usando Mongoose y dos seeders para poblar la base de datos con datos iniciales.

### Modelos

#### 1. Pokemon.js

Ubicación: `src/models/Pokemon.js`

**Campos:**
- `id`: Number, required, unique (identifica el pokémon, 1-1000)
- `name`: String, required, unique, minlength 2 (nombre del pokémon)
- `type1`: String, required, enum de 18 tipos (tipo principal)
- `type2`: String, opcional, enum de 18 tipos (tipo secundario)
- `imageUrl`: String, required (referencia al archivo PNG descargado)

**Tipos disponibles:**
```javascript
['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting',
 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost',
 'Dragon', 'Dark', 'Steel', 'Fairy']
```

#### 2. PokemonSolution.js

Ubicación: `src/models/PokemonSolution.js`

**Campos:**
- `gameNumber`: Number, required, unique (identifica el juego del día, 1+)
- `pokemonId`: Number, required (el pokémon solución para ese día)
- `date`: Date, required (fecha del juego)

### Seeders

#### seedPokemon.js

Ubicación: `src/db/seeders/seedPokemon.js`

**¿Qué hace?**
1. Lee el archivo `json/pokedex-1-1000.json`
2. Mapea los 1000 pokémon al esquema de Pokemon.js
3. Asigna tipos aleatoriamente (sin type2)
4. Asigna imageUrl basado en el pokemonId
5. Inserta en MongoDB usando `insertMany()`

**Ejecución:**
```bash
npm run seed
# O directamente:
node src/db/seeders/seedPokemon.js
```

#### seedSolutions.js

Ubicación: `src/db/seeders/seedSolutions.js`

**¿Qué hace?**
1. Lee la fecha de inicio de `POKEMON_SOLUTION_START_DATE` (config)
2. Crea 365 soluciones (una por día)
3. Para cada día:
   - Asigna un `gameNumber` (1, 2, 3, ...)
   - Elige un `pokemonId` aleatorio (1-1000)
   - Registra la fecha incrementando desde la fecha de inicio
4. Limpia soluciones previas antes de insertar

**Ejecución:**
```bash
npm run seed
# O directamente:
node src/db/seeders/seedSolutions.js
```

### Configuración Requerida

En `.env`, asegúrate de tener:

```bash
POKEMON_SOLUTION_START_DATE=2025-01-10
```

Esta fecha es el punto de partida para el gameNumber 1.

### Flujo de Setup Completo

```bash
# 1. Navegar a la carpeta backend
cd public/WhoIsThisPokemon/backend

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env
cp .env.example .env
# Editar .env con valores reales (especialmente MONGO_URI)

# 4. Asegurarse que MongoDB está corriendo
# mongod (en otra terminal)

# 5. Descargar imágenes (Milestone 1)
npm run fetch-images

# 6. Poblar base de datos (Milestone 2)
npm run seed
```

### Verificación

Después de ejecutar los seeders, verifica en MongoDB:

```bash
# Conectar a MongoDB y ver los datos
mongosh

# En la shell:
use pokemon
db.pokemons.countDocuments()      # Debería mostrar 1000
db.pokemonsolutions.countDocuments()  # Debería mostrar 365
```

### Próximas Milestones

- **Milestone 3**: Autenticación (reutilizar sistema)
- **Milestone 4**: API REST CRUD de pokémon

---
