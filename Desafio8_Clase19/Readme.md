# Desafio 7 Clase 17

## Routes

### Cart Route => /api/carts

// get all carts

- get("/");
// get cart by id
- get("/:cid");
//create new cart
- post("/");
// Add new product in cart by cart id and product id
- post("/:cid/product/:pid");
//update one product in cart by cart id and product id
- put("/:cid/product/:pid");
//update all product in cart by cart id
- put("/:cid");
//delete product in cart by  id cart and id product
- delete("/:cid/product/:pid")
//delete cart by id
- delete("/:cid/");

### Product Route => /api/products

- router.get("/")
- router.delete("/:pid")
- router.get("/:pid")
- router.post("/");
- router.put("/:pid")

## Routes Views

- router.get("/") => redirect("/home")
- router.get("/home") => render("home");
- router.get("/realTimeProducts") => render("realTimeProducts")
- router.get("/chat") => render("chat")
- router.get("/addProducts") => render("addProducts")

### Features Complete

- Uso de Socket y handlebars
- Acedé a la rutas /realTimeProducts y / para visualizar los productos
- populate in - get("/:cid");
- Chatbot in /chat

## Instalación y configuración del entorno de desarrollo

1. Clonar el repositorio en tu máquina local: `git clone <https://github.com/FinochioAdrian/Desafios_BackEnd_FinochioAdrian_CoderHouse/>

2. Posicionarse en la carpeta del desafío correspondiente

3. Instalar dependencias "npm i"

4. Ejecutar con "npm run start";
