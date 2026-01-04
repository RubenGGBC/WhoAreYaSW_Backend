# Who Is This Pokemon? - Backend

Backend del extra **"Who Is This Pokémon?"**, desarrollado con **Node.js + Express** y **MongoDB (Mongoose)**.

---

## Dónde está el proyecto ahora

Toda la parte de Pokémon está contenida en la carpeta:

- `WhoIsThisPokemon/` (en la raíz del repositorio)

Dentro de ella conviven:
- Backend (Node/Express/Mongo) en la **misma carpeta** (`server.js`, `src/`, etc.)
- Frontend estático del extra en `WhoIsThisPokemon/public/` (html/css/js/json)
- Vistas EJS en `WhoIsThisPokemon/views/`
- Recursos (imágenes) en `WhoIsThisPokemon/public/images/`

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

### 4. Gestión de configuración (ACTUALIZADO)

Este proyecto está alineado con el backend principal (juego de fútbol):

- **No usamos un módulo de configuración centralizado**.
- `src/app.js` lee directamente de **variables de entorno** (`process.env`).

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

Notas:
- Las sesiones se guardan en Mongo con `connect-mongo`.
- El TTL se configura como en el proyecto raíz: `ttl: 24 * 60 * 60`.

---

### 5. Especificación: rutas del sistema

#### Rutas de API Pokémon (CRUD)

| Tipo | Método | Endpoint | Descripción | Autorización |
|------|--------|----------|-------------|--------------|
| API | GET | `/api/pokemon` | Obtener lista de Pokémon (paginado) | Pública |
| API | GET | `/api/pokemon/:id` | Obtener Pokémon por id (acepta `id` numérico o `_id`) | Pública |
| API | POST | `/api/pokemon` | Crear Pokémon | Admin |
| API | PUT | `/api/pokemon/:id` | Actualizar Pokémon | Admin |
| API | DELETE | `/api/pokemon/:id` | Eliminar Pokémon | Admin |

Query params útiles en listado:
- `?page=1&limit=20`
- `?search=bulb` (filtra por nombre)
- `?type=Fire` (filtra si aparece en `type1` o `type2`)

#### Rutas de juego

| Tipo | Método | Endpoint | Descripción | Autorización |
|------|--------|----------|-------------|--------------|
| API | GET | `/api/game/current` | Obtener número del juego actual | Pública |
| API | GET | `/api/game/:gameNumber` | Info del juego | Pública |
| API | GET | `/api/solution/:gameNumber` | Solución del día (devuelve el Pokémon completo) | Pública |

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

**Actualización importante:**
- `seedPokemon.js` ahora es **idempotente** (borra la colección antes de insertar) para poder ejecutar `npm run seed` varias veces sin errores de duplicados.

---

## Milestone 3: Gestión de usuarios: autentificación y autorización

Se ha aprovechado el sistema de usuarios del backend principal de WhoAreYa.

- Cualquier usuario puede leer (GET) los datos públicos.
- Solo un usuario con rol `admin` puede crear/editar/eliminar Pokémon.

---

## Milestone 4: API REST - CRUD de Pokémon

Este milestone implementa una **API RESTful** para la entidad `Pokemon`, siguiendo el mismo patrón que el CRUD de `Player` del proyecto raíz:

- Lecturas (**GET**) públicas para soportar el juego (sin login).
- Escrituras (**POST/PUT/DELETE**) protegidas por sesión y rol `admin`.
- Respuestas consistentes en JSON.
- **Subida de imágenes** con multer (idéntico al sistema de jugadores).
- **Validación robusta** en controladores con arrays de errores detallados.

### 4.1. Endpoints CRUD

#### GET `/api/pokemon`
Lista paginada de Pokémon.

Query params:
- `page` (por defecto `1`)
- `limit` (por defecto `20`)

Filtros opcionales:
- `search`: búsqueda por nombre (case-insensitive, con escape de regex)
- `type`: filtra si coincide con `type1` o `type2` (case-insensitive exacto)

Ejemplo:
- `/api/pokemon?page=1&limit=10&type=Fire&search=char`

**Mejoras de seguridad:**
- Búsquedas con `escapeRegex()` para prevenir inyecciones en regex.
- Filtros case-insensitive con coincidencia exacta para tipos.

#### GET `/api/pokemon/:id`
Obtiene un Pokémon por:
- `id` numérico de pokedex (por ejemplo `25` → Pikachu), o
- `_id` de MongoDB (ObjectId).

**Búsqueda dual:** Si el parámetro es numérico, busca por `id`; si no, busca por `_id`.

#### POST `/api/pokemon`
Crea un nuevo Pokémon.

- Requiere sesión + rol `admin`.
- Soporta **multipart/form-data** para subir imagen.
- Body (ejemplo):
  - `id` (int, requerido)
  - `name` (string, requerido, mínimo 2 caracteres)
  - `type1` (string, requerido)
  - `type2` (string, opcional)
  - `imageUrl` (string, opcional)
  - `image` (file, opcional) - imagen PNG/JPEG/GIF (máx 5MB)

**Validaciones:**
- ID numérico requerido y único.
- Nombre mínimo 2 caracteres y único.
- Verificación de duplicados por ID o nombre.
- Si se sube imagen, se guarda automáticamente como `public/images/pokemon/{id}.png`.

#### PUT `/api/pokemon/:id`
Actualiza todos los campos de un Pokémon.

- Requiere sesión + rol `admin`.
- Soporta **multipart/form-data** para actualizar imagen.
- Mismas validaciones que `POST`.
- Permite actualizar imagen existente.

**Búsqueda dual:** Acepta tanto `id` numérico como `_id` de MongoDB.

#### DELETE `/api/pokemon/:id`
Elimina un Pokémon.

- Requiere sesión + rol `admin`.
- **Búsqueda dual:** Acepta tanto `id` numérico como `_id` de MongoDB.

### 4.2. Endpoints del juego (públicos, sin login)

Estos endpoints soportan la mecánica del juego, igual que en el juego de fútbol:

#### GET `/api/game/current`
Obtiene el número del juego actual basado en la fecha.

Respuesta:
```json
{
  "success": true,
  "data": {
    "gameNumber": 5,
    "date": "2025-01-15T00:00:00.000Z"
  }
}
```

#### GET `/api/game/:gameNumber`
Información sobre un juego específico.

Respuesta:
```json
{
  "success": true,
  "data": {
    "gameNumber": 1,
    "date": "2025-01-10T00:00:00.000Z",
    "hasSolution": true
  }
}
```

#### GET `/api/solution/:gameNumber`
Devuelve la solución del día (IDs del Pokémon).

Respuesta:
```json
{
  "success": true,
  "data": {
    "pokemonId": 25,
    "_id": "507f1f77bcf86cd799439011"
  }
}
```

**Nota:** Devuelve tanto el `pokemonId` numérico como el `_id` de MongoDB, igual que el sistema de jugadores.

### 4.3. Formato de respuestas

Éxito (ejemplo):

```json
{
  "success": true,
  "data": {
    "id": 25,
    "name": "pikachu",
    "type1": "Electric",
    "type2": null,
    "_id": "507f1f77bcf86cd799439011"
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1000,
    "pages": 50
  },
  "message": "Pokémon obtenido exitosamente"
}
```

Error con validación detallada (ejemplo):

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos inválidos",
    "details": [
      "El ID del Pokémon es requerido",
      "El nombre debe tener al menos 2 caracteres",
      "El tipo 1 es requerido"
    ]
  }
}
```

### 4.4. Códigos de estado usados

- `200` OK (lectura exitosa)
- `201` Created (creación exitosa)
- `400` Bad Request (validación fallida, duplicados)
- `401` Unauthorized (no autenticado)
- `403` Forbidden (no admin)
- `404` Not Found (recurso no encontrado)
- `500` Internal Server Error (error del servidor)

### 4.5. Subida de imágenes con Multer

Similar al sistema de jugadores, se configuró **Multer** para manejar la subida de imágenes:

**Configuración** (`src/config/multer.js`):
- Destino: `public/images/pokemon/`
- Nombre: `{pokemonId}.png`
- Tipos permitidos: JPEG, PNG, GIF
- Tamaño máximo: 5MB

**Uso en rutas:**
```javascript
router.post('/pokemon', isAuthenticated, isAdmin, upload.single('image'), pokemonController.createPokemon);
router.put('/pokemon/:id', isAuthenticated, isAdmin, upload.single('image'), pokemonController.updatePokemon);
```

**Flujo:**
1. El middleware `upload.single('image')` procesa la imagen.
2. Se guarda temporalmente con el ID del body.
3. El controlador renombra al ID final después de crear/actualizar.

### 4.6. Arquitectura de controladores

Los controladores (`src/controllers/pokemonController.js` y `pokemonGameController.js`) están **100% alineados** con los controladores de jugadores:

**Características compartidas:**
- Función `escapeRegex()` para búsquedas seguras
- Validación robusta con arrays de errores
- Manejo de imágenes con `req.file`
- Búsqueda dual por ID numérico o MongoDB `_id`
- Verificación de duplicados antes de crear/actualizar
- Manejo consistente de errores con `.catch(() => null)`
- Formato de respuestas idéntico

**Ejemplo de validación en controlador:**
```javascript
const errors = [];

if (!id) {
  errors.push('El ID del Pokémon es requerido');
} else if (typeof id !== 'number' && isNaN(id)) {
  errors.push('El ID debe ser un número');
}

if (!name) {
  errors.push('El nombre es requerido');
} else if (name.length < 2) {
  errors.push('El nombre debe tener al menos 2 caracteres');
}

if (errors.length > 0) {
  return res.status(400).json({
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Datos inválidos',
      details: errors
    }
  });
}
```

### 4.7. Frontend: `loaders.js` usando la API

Siguiendo la solución del juego de fútbol, el frontend se apoya en `fetchJSON()` del loader:

- Para `fetchJSON('pokedex-1-1000')` se hace una llamada a:
  - `GET /api/pokemon?limit=1000`

Y se **normaliza** al formato esperado por el frontend:
- `pokemonId` → `id`
- `pokemonName` → `name`
- `type1` / `type2`

La solución del día se obtiene dinámicamente:
- `GET /api/game/current` → obtiene el número del juego
- `GET /api/solution/:gameNumber` → obtiene el Pokémon solución

---

## Milestone 5: Panel de administración web (Admin)

Este milestone implementa un panel web para administradores para **gestionar Pokémon** de forma visual, consumiendo la **API REST** del Milestone 4.

### 5.1 Objetivos cubiertos

- Vistas del panel con **EJS**.
- Formularios HTML para operaciones CRUD.
- Comunicación con la API REST mediante **fetch** desde el navegador.
- Protección de rutas con **sesión + rol `admin`**.
- Mensajes de feedback (éxito/error) y confirmación antes de eliminar.

### 5.2 Separación de rutas (prefijos)

La separación es la misma que en el proyecto original (juego de fútbol):

- `/` : Frontend del juego (público, sin login).
- `/api/*` : API REST (JSON; escrituras protegidas por auth + rol).
- `/admin/*` : Panel de administración (requiere auth + rol `admin`).

### 5.3 Aproximación elegida (Cliente => API)

Se sigue la **Aproximación 2: Cliente => API** (igual que el proyecto raíz):

- El servidor Express **solo renderiza vistas** (rutas GET).
- El JavaScript del navegador llama directamente a la API REST (`/api/*`) con `fetch`.

Esto mantiene una arquitectura limpia y coherente con el enfoque API-first del proyecto.

### 5.4 Rutas del panel (GET)

> Todas las rutas están protegidas con `isAuthenticated` + `isAdmin`.

- `GET /admin` → Dashboard (lista, búsqueda, filtros, paginación)
- `GET /admin/pokemon/new` → Formulario de creación
- `GET /admin/pokemon/edit/:id` → Formulario de edición

Implementación:
- Rutas: `WhoIsThisPokemon/src/routes/adminRoutes.js`
- Controlador (render EJS): `WhoIsThisPokemon/src/controllers/adminController.js`

### 5.5 Protección de rutas (middleware)

Todas las rutas `/admin/*` pasan por:

- `WhoIsThisPokemon/src/middlewares/authMiddleware.js`
  - `isAuthenticated`: requiere `req.session.userId`
  - `isAdmin`: requiere `req.session.userRole === 'admin'`

> Nota: el panel no usa tokens; usa sesión con `express-session` + `connect-mongo` (igual que el juego principal).

### 5.6 Operaciones CRUD (siempre vía API REST)

El panel **no accede a la base de datos** directamente: todas las operaciones se hacen llamando a la API.

- Listar: `GET /api/pokemon` (con `page`, `limit`, `search`, `type`)
- Obtener 1: `GET /api/pokemon/:id`
- Crear: `POST /api/pokemon` (JSON o `multipart/form-data` si hay imagen)
- Actualizar: `PUT /api/pokemon/:id` (JSON o `multipart/form-data` si hay imagen)
- Eliminar: `DELETE /api/pokemon/:id`

Cliente API (fetch):
- `WhoIsThisPokemon/public/admin/js/api-client.js`

### 5.7 Frontend del panel

Vistas EJS:
- `WhoIsThisPokemon/views/admin/dashboard.ejs`
- `WhoIsThisPokemon/views/admin/new-pokemon.ejs`
- `WhoIsThisPokemon/views/admin/edit-pokemon.ejs`

JS del panel:
- Dashboard: `WhoIsThisPokemon/public/admin/js/admin-main.js`
- Crear: `WhoIsThisPokemon/public/admin/js/pokemon-form.js`
- Editar: `WhoIsThisPokemon/public/admin/js/pokemon-edit.js`
- Autocomplete: `WhoIsThisPokemon/public/admin/js/admin-autocomplete.js`

CSS:
- `WhoIsThisPokemon/public/admin/css/admin.css`

### 5.8 Imágenes

- Las imágenes se sirven desde la ruta pública: `WhoIsThisPokemon/public/images/pokemon/`
- Las URLs que usa el panel siguen el mismo patrón que el proyecto original:
  - `/images/pokemon/{id}.png`

Configuración en Express:
- `WhoIsThisPokemon/src/app.js` expone `/images/pokemon` apuntando a `public/images/pokemon`.

Importante:
- **No existe `default.png`** para Pokémon. Cuando una imagen no está disponible, el UI la oculta (en el autocomplete) o simplemente se verá rota según el componente.

### 5.9 Validaciones y UX

- Validación HTML5 (required, min, etc.) en los formularios.
- Validación adicional en JS para mostrar errores por campo.
- Confirmación antes de eliminar.
- Mensajes de éxito/error (alertas) al crear, actualizar y eliminar.

---

## Milestone 6: Propuesta de ejercicios optativos

Se ha aprovechado la Milestone 6 del proyecto raíz (Who Are Ya?) para realizar los siguientes ejercicios optativos aplicados al extra "Who Is This Pokémon?":

- Autentificación OAuth

- Tests automatizados (Jest + Supertest)

-  JSON Web Tokens

---