# Desafío 10 Clase 24

## Feature Desafío 10
-status  modify
    ok  views
    ok  css
    ok  app.js delete connect-mongo
    ok  util.js
    ok  passport
    ok  view.router mensajes de passport 
    ok  view.router integro passportCall(jwt)
    session.router
    add cart de user
    add image in views carts
    -falta
    arreglar el readme

## Feature Desafío 9

    - Add views
            -- reset-password
    - Add ViewsRouter
            -- router.get("/password-reset")
    - Add SessionRouter
            -- router.post("/password-reset")
            --router.get("/github", passport.authenticate('github',{scope:['user:email']})...)
            --router.get("/githubcallback", passport.authenticate('github',{failureRedirect:'/login',failureFlash:true})...)
    
    - Add in util.js,function for bcrypt, createHash(password), isValidPassword(user,password).
    - Add in passport.config.js passport-local and passport-github2

## Feature Desafío 8

    - Add views 
        -- login
        -- register 
    - Add ViewsRouter
        -- router.get("/register")
        -- router.get("/login")
    - Add SessionRouter
        -- router.post("/register")
        -- router.post("/login")
        -- router.get("/logout")
    - Modify views Products for look user data in view

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
