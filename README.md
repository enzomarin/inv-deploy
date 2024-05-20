
<div align="center">

</div>

## Backend de SIStore

### Instalación

1. Clona el repositorio

   ```sh
   git clone git@github.com:enzomarin/inv-deploy.git
   ```

2. Instala los paquetes de NPM

   ```sh
   pnpm install
   ```

3. Ejecuta el proyecto
	 - Base de datos remota ()
   ```sh
   pnpm run dev
   ```
   - Base de datos local
   ```sh
   pnpm run start
   ```

## Registro de usuario
```sh
  POST http://localhost:1234/auth/register

   {
    "rut": "198761234",
    "email": "email@gmail.com",
    "password": "1234",
    "subscriptionEndDate": "12/12/2025"
  }
```
## Login de usuario

```sh
  POST http://localhost:1234/auth/login

  {
    "email": "email@example.com",
    "password": "1234"
  }

  200 ok 
  {
    "rut": "",
    "email": "",
    "token": ""
}
```

## Obtener información del usuario logeado

```sh
GET http://localhost:1234/auth/user
```