# Desafío 15 Clase 37

## Feature Desafío 15

        - status    modify
                modify route    put api/products/:pid
                                solo puede actualizar un producto su creador o un administrador
                modify route    delete api/products/:pid
                                solo puede eliminar un producto su creador o un administrador
                modify route    post api/products/
                                ahora acepta de owner de admin con su id o el owner de premium con su id
                add route       put api/users/premium/:uid
                finish      resetPassword email

## Instalación y configuración del entorno de desarrollo

1. Clonar el folder del repositorio en tu máquina local:
        - git init
        - git remote add origin <https://github.com/FinochioAdrian/Desafios_BackEnd_FinochioAdrian_CoderHouse.git>
        - git config core.sparseCheckout true
        - git sparse-checkout set Desafio15_Clase37
        - git pull origin main

2. Instalar dependencias "npm i"

3. Ejecutar con:
        - inicio Guiado => "npm start";
        - ambiente production => npm run prod
        - ambiente developer => npm run dev
