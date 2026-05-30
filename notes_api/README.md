# Notes API

Pequeña API web en Flask para registrar y administrar notas por usuario. La autenticación se hace con Google OAuth 2.0 y la sesión se guarda en Flask, por lo que cada usuario ve solo sus propias notas.

## Requisitos

- Python 3.11 o superior
- Una base de datos accesible desde `DATABASE_URI`
- Credenciales de Google OAuth configuradas

Variables de entorno necesarias:

- `FLASK_SECRET_KEY`
- `DATABASE_URI`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`

## Cómo ejecutar

1. Abre una terminal en la carpeta `notes_api`.
2. Instala las dependencias:

   ```bash
   pip install -r requirements.txt
   ```

3. Configura las variables de entorno en tu archivo `.env`.
4. Inicia la aplicación:

   ```bash
   python run.py
   ```

5. Abre el navegador en `http://localhost:5000`.

## Cómo probar en el navegador

- En la página principal verás enlaces a `Login with Google`, `My notes`, `My profile` y `Logout`.
- Haz clic en `Login with Google` para autenticarte.
- Después del login, la aplicación te redirige a `GET /api/notes`.
- `GET /me` muestra los datos del usuario autenticado.
- `GET /logout` cierra la sesión.

Si no has iniciado sesión, los endpoints protegidos responden con `401`.

## Cómo probar con Postman

La API usa sesión basada en cookies, así que primero debes autenticarte para poder usar los endpoints protegidos.

### Opciones para autenticarte

1. Abre `http://localhost:5000/login` en el navegador y completa el acceso con Google.
2. Usa la cookie de sesión generada por Flask en Postman, con la cookie jar habilitada o copiando la cookie al request.

### Requests útiles

- `GET http://localhost:5000/api/notes`
- `POST http://localhost:5000/api/notes`
- `DELETE http://localhost:5000/api/notes/<note_id>`
- `GET http://localhost:5000/me`
- `GET http://localhost:5000/logout`

### Ejemplo de POST

```json
{
  "title": "Primera nota",
  "body": "Texto opcional de la nota"
}
```

### Respuestas esperadas

- `200 OK` para consultas exitosas
- `201 Created` al crear una nota
- `204 No Content` al eliminar una nota
- `400 Bad Request` si falta `title`
- `401 Unauthorized` si no hay sesión válida

## Rutas principales

- `/` página inicial con enlaces rápidos
- `/login` inicia el flujo de Google OAuth
- `/oauth/callback` recibe la respuesta de Google
- `/me` devuelve el perfil del usuario autenticado
- `/api/notes` lista y crea notas
- `/api/notes/<note_id>` elimina una nota
