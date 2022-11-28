# Workshop API WhatsApp

## Descripción

En este workshop vamos a instalar esta API en un servidor de Linux de AWS EC2 con Ubuntu Server 20.04 LTS, luego vamos a configurarla para que pueda ser accedida desde el exterior y por último vamos a crear un cliente que se conecte a la API y envíe mensajes de WhatsApp con herramientas como Postman, Insomnia, cURL y formularios HTML.

## Contenido

- [Requisitos](#requisitos)
- [Crear un servidor en AWS EC2 con Ubuntu Server 20.04 LTS](#crear-un-servidor-en-aws-ec2-con-ubuntu-server-2004-lts)
- [Crear una Base de Datos en AWS RDS con MariaDB](#crear-una-base-de-datos-en-aws-rds-con-mariadb) **(NUEVO)**
- [Instalar los paquetes necesarios](#instalar-los-paquetes-necesarios) **(Actualizado - Volver a ejecutar)**
- [Instalar la API](#instalar-la-api) 
- [Configurar la API](#configurar-la-api) **(NUEVO)**
- [Acceder a la API desde el exterior](#acceder-a-la-api-desde-el-exterior)
- [Ejecutar la API](#ejecutar-la-api) **(Actualizado)**
- [Acceder a la API](#acceder-a-la-api)
- [Acceder a la API con Postman](#acceder-a-la-api-con-postman)
- [Acceder a la API con Insomnia](#acceder-a-la-api-con-insomnia)
- [Acceder a la API desde el exterior con el navegador web](#acceder-a-la-api-desde-el-exterior-con-el-navegador-web)
- [Función para añadir comandos a la API con Postman](#función-para-añadir-comandos-a-la-api-con-postman) **(NUEVO)**
- [Función para ver los comandos de la API con Postman](#función-para-ver-los-comandos-de-la-api-con-postman) **(NUEVO)**
- [Disclaimer](#disclaimer)
- [Licencia](#licencia)
- [Librerías utilizadas creadas por terceros](#librerias-utilizadas-creadas-por-terceros)

## Requisitos

- Crear un servidor en AWS EC2 con Ubuntu Server 20.04 LTS
- Tener PuTTY o un cliente SSH para conectarse al servidor
- Instalar Nodejs, npm, git y otros paquetes necesarios para correr la API.
- Instalar la API


## Crear un servidor en AWS EC2 con Ubuntu Server 20.04 LTS

1. Entrar a la consola de AWS y seleccionar EC2
2. Seleccionar la opción "Lanzar instancia"
3. Nombre de la instancia: (ejemplo: api-whatsapp)
4. Seleccionar la opción Ubuntu Server 20.04 LTS (HVM), SSD Volume Type
5. Seleccionar la opción t2.micro
6. Seleccionar la opción Crear un nuevo par de claves
7. Escribir el nombre del par de claves y seleccionar la opción Descargar clave privada (.ppk)
8. Seleccionar la opción "Lanzar instancia"
9. Seleccionar la opción "Conectarse a la instancia"
10. Utilizar el programa Putty para conectarse a la instancia con el par de claves descargado en el paso 7 y la dirección IPv4 pública de la instancia o su nombre de DNS público.

## Crear una Base de Datos en AWS RDS con MariaDB

1. Entrar a la consola de AWS y seleccionar RDS
2. Seleccionar la opción "Crear base de datos"
3. Seleccionar la opción "Creación Estándar"
4. Seleccionar la opción "MariaDB" y la versión 10.6.10
5. Seleccionar la opción "Capa gratuita"
6. Escribir el identificador de la base de datos (ejemplo: api-whatsapp-db)
7. Escribir el nombre de usuario maestro (ejemplo: admin)
8. Escribir la contraseña del usuario maestro (ejemplo: admin123)

9. En la sección "Configuración de la Instancia" seleccionar la opción "db.t3.micro"
10. En la sección de "Almacenamiento" agregar un volumen de **20 GB y deshabilitar "Escalado Automático de Almacenamiento"**

11. En la sección de Conectividad, seleccionar "Conectarse a un recurso informatico de EC2" y seleccionar la instancia creada en el paso 10 de la sección "Crear un servidor en AWS EC2 con Ubuntu Server 20.04 LTS"
12. En la sección de "Grupo de Seguridad de VPC" seleccionar la opción "Elegir existente" y seleccionar el grupo de seguridad de nuestra instancia de EC2.
13. Seleccionar la opción "Crear base de datos"


## Instalar los paquetes necesarios

1. Entrar en la consola de nuestra instancia creada
2. Ejecutar los siguientes comandos

```bash
sudo apt update
sudo apt install nodejs npm git gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget mariadb-client -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
source /home/ubuntu/.bashrc
nvm install 14
nvm use 14
```

## Instalar la API

1. Ejecutar los siguientes comandos en la consola de nuesto servidor

```bash
git clone https://github.com/patobalboa/workshop-api-wsp.git
cd workshop-api-wsp
npm install
```

## Configurar la API

1. En nuestra consola de AWS, seleccionar la opción "RDS" y seleccionar la base de datos creada en el paso 13 de la sección "Crear una Base de Datos en AWS RDS con MariaDB"
2. En la sección "Conectividad y seguridad" se mostrará la dirección IPv4 pública de nuestra base de datos, copiarla.

## Crear nuestra base de datos

1. En la consola de nuestro servidor, ejecutar el siguiente comando

```bash
cd workshop-api-wsp
mysql -h "punto-de-enlace-de-nuestra-base-de-datos" -u admin -p -e "CREATE DATABASE nombre-de-database;"
```
2. Importar la base de datos

```bash
mysql -h "punto-de-enlace-de-nuestra-base-de-datos" -u admin -p nombre-de-database < db.sql
```

3. Ejecutar los siguientes comandos en la consola de nuesto servidor

```bash
nano .env
```

4. Copiar y pegar el siguiente código con los parámetros de nuestra base de datos creada con Amazon RDS

```bash
DB_HOST="Punto de enlace de la base de datos"
DB_USER="Nombre de usuario de la base de datos"
DB_PASSWORD="password de la base de datos"
DB_NAME="Nombre de la base de datos"
```

5. Guardar el archivo con Ctrl + O y salir con Ctrl + X

## Acceder a la API desde el exterior

1. En la consola de AWS ir a la pestaña Security Groups
2. Seleccionar la pestaña Reglas de entrada
3. Seleccionar la opción "Editar reglas de entrada"
4. Seleccionar la opción "Agregar regla"
5. Seleccionar la opción "TCP personalizado"
6. Escribir el puerto 3000
7. Escribir en el Origen el siguiente CIDR "0.0.0.0/0"
8. Seleccionar la opción "Guardar reglas"

## Ejecutar la API

1. En la consola de AWS entrar a la instancia creada
2. Ejecutar los siguientes comandos

```bash
cd workshop-api-wsp
node index.js
```

3. Si todo salió bien, y no había iniciado sesión en la v1.0 de la API, el QR en la siguiente URL:

```bash
Ejemplo: http://ec2-54-234-123-123.compute-1.amazonaws.com:3000/qr
```


## Acceder a la API

1. En "otra" consola de tu ubuntu ejecutar los siguientes comandos mientras que se encuentre ejecutando tu código.

```bash
curl -X POST -H "Content-Type: application/json" -d '{"phone": "56987645321", "message": "Hola Mundo"}' http://localhost:3000/send
```


## Acceder a la API desde el exterior con Postman

1. En el navegador web ingresar la siguiente dirección

```bash
https://www.postman.com/downloads/
```

2. Descargar la opción según tu Sistema Operativo
3. Ejecutar el instalador
4. Abrir Postman
5. Seleccionar la opción "Nueva pestaña"
6. Seleccionar la opción "POST"
7. Escribir la dirección IPv4 pública de la instancia o su nombre de DNS público con el puerto 3000

```bash
Ejemplo: http://ec2-54-234-123-123.compute-1.amazonaws.com:3000/send
```

8. Seleccionar la opción "Body"
9. Seleccionar la opción "raw"
10. Seleccionar la opción "JSON"
11. Escribir el siguiente código

```json
{
    "phone": "56987645321",
    "message": "Hola Mundo"
}
```

12. Seleccionar la opción "Enviar"

## Acceder a la API desde el exterior con Insomnia 

1. En el navegador web ingresar la siguiente dirección

```bash
https://insomnia.rest/download/
```

2. Descargar la opción según tu Sistema Operativo
3. Ejecutar el instalador
4. Abrir Insomnia
5. Seleccionar la opción "Crear solicitud"
6. Seleccionar la opción "POST"
7. Escribir la dirección IPv4 pública de la instancia o su nombre de DNS público con el puerto 3000

```bash
Ejemplo: http://ec2-54-234-123-123.compute-1.amazonaws.com:3000/send
```

8. Seleccionar la opción "Body"
9. Seleccionar la opción "raw"
10. Seleccionar la opción "JSON"
11. Escribir el siguiente código

```json
{
    "phone": "56987645321",
    "message": "Hola Mundo"
}
```

12. Seleccionar la opción "Enviar"

## Acceder a la API desde el exterior con el navegador web

1. En el navegador web ingresar la siguiente dirección

```bash
Ejemplo: http://ec2-54-234-123-123.compute-1.amazonaws.com:3000/form
```

2. Rellenar los campos con los datos requeridos y seleccionar la opción "Enviar".

## Función para añadir comandos a la API con Postman

1. En una nueva pestaña de Postman seleccionar la opción "POST"
2. Escribir la dirección IPv4 pública de la instancia o su nombre de DNS público con el puerto 3000

```bash
Ejemplo: http://ec2-54-234-123-123.compute-1.amazonaws.com:3000/save
```

3. Seleccionar la opción "Body"
4. Seleccionar la opción "raw"
5. Seleccionar la opción "JSON"
6. Escribir el siguiente código.

```json
{
    "command": "hola",
    "message": "Hola Mundo"
}
```

7. Seleccionar la opción "Enviar"

(Nota: Para usar con Insomnia el comando es el mismo)

## Función para ver los comandos de la API con Postman

1. En una nueva pestaña de Postman seleccionar la opción "GET"
2. Escribir la dirección IPv4 pública de la instancia o su nombre de DNS público con el puerto 3000

```bash
Ejemplo: http://ec2-54-234-123-123.compute-1.amazonaws.com:3000/commands
```

3. Seleccionar la opción "Enviar"
4. En la pestaña "Body" se mostrará el resultado de la consulta

(Nota: Para usar con Insomnia el comando es el mismo)


## Disclaimer

Este proyecto no está afiliado, asociado, autorizado, respaldado por, o en alguna forma oficialmente conectado con WhatsApp, o cualquier de sus filiales o sus afiliados. El nombre "WhatsApp" como marca registrada como se usa en este proyecto se usa únicamente con fines de identificación y referencia. 

Los nombres de compañías, productos, servicios y logotipos mencionados en este proyecto son propiedad de sus respectivos dueños. El uso de cualquier marca registrada es solo con fines de identificación y referencia, y no implica ninguna asociación con la marca propietaria.

Este proyecto no está diseñado para ser usado en producción. El uso de esta API es bajo su propio riesgo y responsabilidad. 

El objetivo de este proyecto es únicamente educativo. 


## Licencia

Copyright 2022 Pato Balboa

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.


## Librerías utilizadas creadas por terceros

* [qrcode-terminal](https://www.npmjs.com/package/qrcode-terminal) de [gtanner](https://github.com/gtanner)
* [whatsapp-web.js](https://www.npmjs.com/package/whatsapp-web.js) de [pedroslopez](https://github.com/pedroslopez)













