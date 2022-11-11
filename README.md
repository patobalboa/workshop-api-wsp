# Workshop API WhatsApp

## Descripción

En este workshop vamos a instalar esta API en un servidor de Linux de AWS EC2 con Ubuntu Server 20.04 LTS, luego vamos a configurarla para que pueda ser accedida desde el exterior y por último vamos a crear un cliente que se conecte a la API y envíe mensajes de WhatsApp con herramientas como Postman, Insomnia, cURL y formularios HTML.

## Requisitos

- Crear un servidor en AWS EC2 con Ubuntu Server 20.04 LTS
- Tener PuTTY o un cliente SSH para conectarse al servidor
- Instalar npm y nodejs en el servidor
- Instalar git en el servidor
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


## Instalar npm y nodejs

1. En la consola de AWS entrar a la instancia creada
2. Ejecutar los siguientes comandos

```bash
sudo apt update
sudo apt install nodejs
sudo apt install npm
```

## Instalar git

1. En la consola de AWS entrar a la instancia creada
2. Ejecutar los siguientes comandos

```bash
sudo apt install git
```

## Instalar la API

1. En la consola de AWS entrar a la instancia creada
2. Ejecutar los siguientes comandos

```bash
git clone https://github.com/patobalboa/workshop-api-wsp.git
cd workshop-api-wsp
npm install
```

## Ejecutar la API

1. En la consola de AWS entrar a la instancia creada
2. Ejecutar los siguientes comandos

```bash
cd workshop-api-wsp
npm start
```

## Acceder a la API

1. En la consola de AWS entrar a la instancia creada
2. Ejecutar los siguientes comandos

```bash
curl -X POST -H "Content-Type: application/json" -d '{"phone": "56987645321", "message": "Hola Mundo"}' http://localhost:3000/
```


## Acceder a la API desde el exterior

1. En la consola de AWS ir a la pestaña Security Groups
2. Seleccionar la pestaña Reglas de entrada
3. Seleccionar la opción "Editar reglas de entrada"
4. Seleccionar la opción "Agregar regla"
5. Seleccionar la opción "TCP personalizado"
6. Escribir el puerto 3000
7. Seleccionar la opción "Guardar reglas"

## Acceder a la API desde el exterior con Postman

1. En el navegador web ingresar la siguiente dirección

```bash
https://www.postman.com/downloads/
```

2. Seleccionar la opción "Descargar Postman para Windows"
3. Ejecutar el instalador
4. Abrir Postman
5. Seleccionar la opción "Nueva pestaña"
6. Seleccionar la opción "POST"
7. Escribir la dirección IPv4 pública de la instancia o su nombre de DNS público con el puerto 3000

```bash
Ejemplo: http://ec2-54-234-123-123.compute-1.amazonaws.com:3000/
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

2. Seleccionar la opción "Descargar para Windows"
3. Ejecutar el instalador
4. Abrir Insomnia
5. Seleccionar la opción "Crear solicitud"
6. Seleccionar la opción "POST"
7. Escribir la dirección IPv4 pública de la instancia o su nombre de DNS público con el puerto 3000

```bash
Ejemplo: http://ec2-54-234-123-123.compute-1.amazonaws.com:3000/
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
Ejemplo: http://ec2-54-234-123-123.compute-1.amazonaws.com:3000/
```

2. Rellenar los campos con los datos requeridos y seleccionar la opción "Enviar".










