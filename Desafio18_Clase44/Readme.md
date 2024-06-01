# Desafío 18 Clase 44

## Feature Desafío 18
      - Feature_Number   Status                Action          Description
        
        18_01            finished            Modify          move /api/users/premium/:uid To /api/users in users.router file
        18_02            started            Modify          modify User model, add new property "last_connection" and this modify when the user login or logout
        18_03            undstarted            Modify          modify User model, add new property "documents" 
        18_04            undstarted            add             add endpoint post in api/users/:uid/documents y que permita subir file y que modificar el status del user
        18_05            undstarted            Modify          archivos posbles para subir profile, products,documents
        18_06            undstarted            Modify          modify /api/users/premium/:uid para que actulize al usuario como premium solo si ha cargado los siguientes documentos identificacion, Comprobante de domicilio, comprobante de estado de cuenta, devolver error indicando que el usuario no ha terminado de procesar su documentacion.
        
## Instalación y configuración del entorno de desarrollo

1. Clonar el folder del repositorio en tu máquina local:
        - git init
        - git remote add origin <https://github.com/FinochioAdrian/Desafios_BackEnd_FinochioAdrian_CoderHouse.git>
        - git config core.sparseCheckout true
        - git sparse-checkout set Desafio16_Clase39
        - git pull origin main

2. Instalar dependencias "npm i"

3. Ejecutar con:
        - inicio Guiado => "npm start";
        - ambiente production => npm run prod
        - ambiente developer => npm run dev
