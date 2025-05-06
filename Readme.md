# Back-end User

Este proyecto es una API REST para la gestión de usuarios, construida con **Node.js**, **Express** y **MongoDB**. Permite crear, consultar, actualizar y eliminar usuarios. También incluye un sistema de autenticación basado en **JSON Web Tokens (JWT)** y validaciones de roles (Administrador / Usuario).

## Requisitos Previos

1. **Node.js** (versión 14 o superior).
2. **MongoDB** (puedes usar MongoDB Atlas o una instalación local).
3. **npm** o **yarn** para instalar las dependencias.

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/jlio215/back-end-user.git
   ```

2. Entra a la carpeta del proyecto:

   ```bash
   cd back-end-user
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```
   o
   ```bash
   yarn
   ```

## Configuración

1. Crea un archivo `.env` en la raíz del proyecto. Ejemplo de configuración mínima:

   ```plaintext
   PORT=3000
   MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/miBaseDeDatos
   JWT_SECRET=123456
   ```

   - **PORT**: Puerto en el que correrá tu servidor (por defecto 3000).  
   - **MONGO_URI**: URL de conexión a tu base de datos MongoDB.  
   - **JWT_SECRET**: Clave secreta para firmar y verificar los JWT.

2. Asegúrate de tener permisos de red en MongoDB Atlas (o tu instancia local) para que el servidor pueda conectarse a la base de datos.

## Uso

Para iniciar el servidor, ejecuta:

```bash
node server.js
```

El servidor se ejecutará en el puerto especificado en el `.env` (por defecto `3000`).

### Creación de un Usuario Administrador

Muchos endpoints requieren que exista al menos un **usuario con rol Administrador** para realizar las operaciones (debido a los middlewares `validateJWT` y `validateRolAdmin`). Tienes dos opciones:

1. **Crear el usuario Administrador directamente en la base de datos**:  
   - Desde MongoDB Atlas o tu cliente de Mongo, inserta manualmente un documento en la colección `usuarios` con `rol: "Administrador"`.

2. **Deshabilitar temporalmente los middlewares** en la ruta de creación de usuarios** (`createUsuario`) y luego crear el usuario con rol "Administrador".  
   - Una vez creado, vuelve a habilitar los middlewares para seguir usando la API de forma segura.

### Generación y Uso del Token (JWT)

1. **Generar Token**: Al crear un usuario, implementa la lógica para firmar el JWT, en usuario debe hacer log-in y este le genera el token JWT.  
2. **Enviar Token**: Al consumir endpoints protegidos, envía el token en la cabecera `Authorization` con el formato `Bearer <TU_TOKEN>`.

### Endpoints Principales

| Método | Endpoint                | Descripción                                                         |
|--------|-------------------------|---------------------------------------------------------------------|
| POST   | `/auth`                 | Log-in. *(Requiere email y password)*                               |
| POST   | `/usuarios`             | Crea un nuevo usuario. *(Requiere JWT y rol Admin)*                 |
| GET    | `/usuarios`             | Obtiene la lista de usuarios con paginación. *(Requiere JWT y rol Admin)* |
| GET    | `/usuarios/buscar`      | Busca usuarios por ciudad. *(Requiere JWT y rol Admin)*             |
| GET    | `/usuarios/:id`         | Obtiene un usuario por su ID. *(Requiere JWT y rol Admin)*          |
| PUT    | `/usuarios/:id`         | Actualiza un usuario por su ID. *(Requiere JWT y rol Admin)*        |
| DELETE | `/usuarios/:id`         | Elimina un usuario por su ID. *(Requiere JWT y rol Admin)*          |

#### Ejemplo de petición protegida en Postman
```http
GET /usuarios?page=1&limit=10 HTTP/1.1
Host: localhost:3000
Authorization: Bearer <TU_TOKEN_AQUÍ>
```


## Contribución

1. Haz un fork del proyecto.
2. Crea una rama nueva (`git checkout -b feature/nueva-feature`).
3. Realiza tus cambios y haz commits descriptivos.
4. Haz push a la rama (`git push origin feature/nueva-feature`).
5. Crea un **Pull Request** en este repositorio.

## Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Consulta el archivo [`LICENSE`](LICENSE) para más detalles.
