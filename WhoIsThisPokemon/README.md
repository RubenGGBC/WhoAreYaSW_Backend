# Who Is This Pokemon? - Backend

Backend del extra **"Who Is This Pokémon?"**, desarrollado con **Node.js + Express** y **MongoDB (Mongoose)**.

---

## Dónde está el proyecto ahora

Toda la parte de Pokémon está contenida en la carpeta:

- `WhoIsThisPokemon/` (en la raíz del repositorio)

Dentro de ella conviven:
- Backend (Node/Express/Mongo) en la **misma carpeta** (`server.js`, `src/`, etc.)
- Frontend estático del extra en `WhoIsThisPokemon/public/` (html/css/js/json)
- Recursos (imágenes) en `WhoIsThisPokemon/images/`

---

## Milestone 0: Diseño y justificación de la arquitectura

### 1. Estructura del Proyecto

**Opción elegida: C - Estructura Híbrida**

Mantenemos una separación clara entre:
- Servidor y lógica (backend): `WhoIsThisPokemon/server.js` + `WhoIsThisPokemon/src/**`
- Cliente estático (frontend): `WhoIsThisPokemon/public/**`
- Recursos servidos localmente (imágenes): `WhoIsThisPokemon/images/**`

#### Justificación
- Claridad: el backend está encapsulado en `src/` y el punto de entrada es único.
- Escalabilidad: podemos crecer en controladores/rutas/modelos sin ensuciar la raíz.
- Reutilización de patrones: es muy similar al backend principal.
- Mantenibilidad: estructura predecible y fácil de navegar.

---

### 2. Punto de entrada del servidor

**Opción elegida: B - `server.js`**

Archivo:
- `WhoIsThisPokemon/server.js`

Responsabilidades:
- Cargar variables de entorno (`dotenv`).
- Conectar a MongoDB.
- Importar `src/app.js`.
- Arrancar Express en un puerto configurable.

#### Justificación
- Simplicidad: un único punto de arranque.
- Coherencia: encaja con la estructura modular en `src/`.

---

### 3. Organización de carpetas

**Opción elegida: A - Por tipo**

Estructura real (resumida):

```
WhoIsThisPokemon/
├── server.js
├── package.json
├── .env(.example)
├── src/
│   ├── app.js
│   ├── config/
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── scripts/
├── public/
├── images/
└── views/
```

#### Justificación
- Claridad: todos los modelos juntos, todos los controladores juntos, etc.
- Es un proyecto pequeño/medio: esta organización es suficiente.

---

### 4. Gestión de configuración

**Opción elegida: B - Configuración centralizada (recomendada)**

La app carga `.env` y reúne la configuración del proyecto en un único punto (vía config).

Variables esperadas:

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

---

### 5. Especificación: rutas del sistema

#### Rutas de API Pokémon

| Tipo | Método | Endpoint | Descripción | Autorización |
|------|--------|----------|-------------|--------------|
| API | GET | `/api/pokemon` | Obtener lista de Pokémon (paginado) | Pública |
| API | GET | `/api/pokemon/:id` | Obtener Pokémon por id | Pública |
| API | POST | `/api/pokemon` | Crear Pokémon | Admin |
| API | PUT | `/api/pokemon/:id` | Actualizar Pokémon | Admin |
| API | DELETE | `/api/pokemon/:id` | Eliminar Pokémon | Admin |

#### Rutas de juego

| Tipo | Método | Endpoint | Descripción | Autorización |
|------|--------|----------|-------------|--------------|
| API | GET | `/api/game/current` | Obtener número del juego actual | Pública |
| API | GET | `/api/game/:gameNumber` | Info del juego | Pública |
| API | GET | `/api/solution/:gameNumber` | Solución del día | Pública |

#### Rutas de autenticación

| Tipo | Método | Endpoint | Descripción | Autorización |
|------|--------|----------|-------------|--------------|
| API | POST | `/auth/register` | Registrar usuario | Pública |
| API | POST | `/auth/login` | Iniciar sesión | Pública |
| API | POST | `/auth/logout` | Cerrar sesión | Autenticada |
| API | GET | `/auth/me` | Usuario actual | Autenticada |

---

## Milestone 1: Scraping de imágenes de Pokémon

### ¿Qué hemos hecho?

Creamos un script que descarga automáticamente las **1000 imágenes** de Pokémon desde el repositorio de sprites oficial (PokeAPI en GitHub) y las guarda localmente en:

- `WhoIsThisPokemon/images/pokemon/`

Así podemos servir las imágenes desde nuestro propio servidor (sin depender de URLs externas).

### Script: `fetchPokemonImages.js`

Ubicación:
- `WhoIsThisPokemon/src/scripts/fetchPokemonImages.js`

Resumen:
1. Lee `public/json/pokedex-1-1000.json`.
2. Para cada Pokémon construye la URL de la imagen.
3. Descarga con **throttling** (10 req/s) para evitar rate-limit.
4. Guarda `images/pokemon/{pokemonId}.png` usando streams.

### URL de descarga

```
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png
```

---

## Milestone 2: MongoDB - modelos y seeders

### ¿Qué hemos hecho?

Creamos:
- Modelos `Pokemon` y `PokemonSolution` con Mongoose.
- Seeders para poblar MongoDB a partir de JSON (pokedex) y generar soluciones diarias.

### Modelos

#### `Pokemon`

Ubicación: `src/models/Pokemon.js`

Campos (resumen):
- `id` (Number, required, unique)
- `name` (String, required, unique)
- `type1` (String, required, enum)
- `type2` (String, opcional, enum)
- `imageUrl` (String, required)

#### `PokemonSolution`

Ubicación: `src/models/PokemonSolution.js`

Campos:
- `gameNumber` (Number, required, unique)
- `pokemonId` (Number, required)
- `date` (Date, required)

### Seeders

- `src/db/seeders/seedPokemon.js`: inserta los 1000 Pokémon.
- `src/db/seeders/seedSolutions.js`: genera 365 soluciones a partir de `POKEMON_SOLUTION_START_DATE`.

---

## Instalación y ejecución (Windows / cmd)

Desde la raíz del repo, entra a la carpeta del proyecto:

```bat
cd WhoIsThisPokemon
npm install
```

Crea `.env` a partir de `.env.example` (en cmd no existe `cp`):

```bat
copy .env.example .env
```

Arranque:

```bat
npm run dev
```

Scripts útiles:
- Descargar imágenes: `npm run fetch-images`
- Poblar la BD: `npm run seed`

---

## Verificación rápida en MongoDB

Tras ejecutar los seeders:

- DB `pokemon`
- `pokemons`: 1000 docs
- `pokemonsolutions`: 365 docs

---

## Nota sobre el enunciado “original”

Las milestones del enunciado (scraping, MongoDB/modelos, etc.) se plantean para el proyecto principal de fútbol. En este extra se han adaptado a Pokémon:
- en vez de descargar banderas/escudos/jugadores, descargamos sprites oficiales de Pokémon.
- en vez de Player/Team/League, modelamos Pokemon y la solución diaria del juego.

---
