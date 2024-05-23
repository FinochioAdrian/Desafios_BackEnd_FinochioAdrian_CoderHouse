import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import usersModel from "../feature/users/users.model.js";
import cartModel from "../feature/carts/cart.model.js";
import productModel from "../feature/products/product.model.js";
import { createHash } from "../utils.js";


const url = "mongodb://localhost:27017/loginClase20"

mongoose.connect(url)
const requester = supertest('http://localhost:8080')





let cookieUser;
let cookieAdmin;
let mockUser = {
    first_name: 'Adrian',
    last_name: 'Finochio',
    age: 30,
    email: 'eidrienhez33@gmail.com',
    password: '123456789',
}
let mockUserAdmin = {
    first_name: 'Admin',
    last_name: 'Admin',
    age: 99,
    email: 'adminTiendita@gmail.com',
    password: '123456789',
    role: 'admin'
}
describe('Testing API', () => {
    before(async function () {
        await usersModel.deleteMany({})
        await cartModel.deleteMany({})
        await productModel.deleteMany({})


        this.timeout = 5000

    })

    describe('La db esta vacia', () => {
        it('La Tabla users Esta vacia', async () => {
            const users = await usersModel.find()
            expect(users).to.be.empty
        })
        it('La Tabla cart Esta vacia', async () => {
            const cart = await cartModel.find()
            expect(cart).to.be.empty

        })
        it('La Tabla product Esta vacia', async () => {
            const product = await productModel.find()
            expect(product).to.be.empty

        })
        it('Se creo un usuario Admin correctamente', async () => {
            let {email,password} = mockUserAdmin
            password = createHash(mockUserAdmin.password)
            
            
            await usersModel.create({...mockUserAdmin,password})
            
            const userAdmin = await usersModel.findOne({ email, password })
            expect(userAdmin.email).to.be.equal(mockUserAdmin.email)
            expect(userAdmin.role).to.be.equal(mockUserAdmin.role)

        })
    })




    describe("Endpoint Users test", () => {
        it('/api/sessions/register Debe registrar correctamente a un usuario', async function () {



            const { statusCode, ok, _body } = await requester.post('/api/sessions/register').set('Accept', 'application/json').send(mockUser)



            expect(statusCode).to.be.equal(200)
            expect(_body).to.be.eql({ status: 'success', message: 'Usuario registrado exitosamente' })


        })
        it('/api/sessions/login Debe logear un usuario correctamente y DEVOLVER UNA COOKIE', async function () {


            const result = await requester.post('/api/sessions/login').set('Accept', 'application/json').send(mockUser)
            const cookieResult = result.headers['set-cookie'][0]
            expect(cookieResult).to.be.ok
            cookieUser = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            expect(result.statusCode).to.be.equal(200)
            expect(cookieUser.name).to.be.ok.and.eql('jwt')
            expect(cookieUser.value).to.be.ok
            expect(result._body).to.be.eql({ status: "success", msg: "Logged in" })






        })
        it('/api/sessions/login Debe logear un admin correctamente y DEVOLVER UNA COOKIE', async function () {

            const { email, password } = mockUserAdmin
            
            
            const result = await requester.post('/api/sessions/login').set('Accept', 'application/json').send({ email, password })
            const cookieResult = result.headers['set-cookie'][0]
            expect(cookieResult).to.be.ok
            cookieAdmin = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            expect(result.statusCode).to.be.equal(200)
            expect(cookieAdmin.name).to.be.ok.and.eql('jwt')
            expect(cookieAdmin.value).to.be.ok
            expect(result._body).to.be.eql({ status: "success", msg: "Logged in" })






        })
        it('/api/sessions/current Debe retornar los datos de un usuario correctamente', async function () {

            const { _body } = await requester.get('/api/sessions/current').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`])

            expect(_body.payload.email).to.be.eql(mockUser.email)

        })

        describe("Endpoint Products test",  () => {
            let pid

            it("post /api/sessions/products permite añadir un producto con imagen solo a usuarios premium y admin", async () => {
                const mockProducts = {
                    title: "Notebook Chiken",
                    description: "Nuevo Notebook Chiken",
                    code: "Chiken1000",
                    price: 10000,
                    status: true,
                    stock: 10,
                    category: "IT",
                    thumbnails: [
                        "./src/test/ImgProductTest/NotebookChiken.webp"
                    ]
                }

                const {statusCode,_body} = await requester.post("/api/products/").set('Accept', 'application/json').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`])                
                    .field('title', mockProducts.title)
                    .field('description', mockProducts.description)
                    .field('code', mockProducts.code)
                    .field('price', mockProducts.price)
                    .field('status', mockProducts.status)
                    .field('stock', mockProducts.stock)
                    .field('category', mockProducts.category)
                    .attach("thumbnails", mockProducts.thumbnails[0])
                    
                    
                    
                    expect(statusCode).to.be.eq(403)
                    expect(_body).to.have.property("error").with.eql('No permissions')

                const {statusCode:code,_body:body} = await requester.post("/api/products/").set('Accept', 'application/json').set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`])                
                    .field('title', mockProducts.title)
                    .field('description', mockProducts.description)
                    .field('code', mockProducts.code)
                    .field('price', mockProducts.price)
                    .field('status', mockProducts.status)
                    .field('stock', mockProducts.stock)
                    .field('category', mockProducts.category)
                    .attach("thumbnails", mockProducts.thumbnails[0])                   
                    

                    expect(code).to.be.eq(201)
                    expect(body).to.be.an("object").and.to.have.property('payload')
                    pid=body.payload._id
                    

            })

            it("get /api/products devuelve una lista de productos solo a usuarios logueados ", async () => {
                

                let result = await requester.get("/api/products/").set('Accept', 'application/json')               
                                                          
                expect(result.statusCode).to.be.eq(401)
                expect(result._body).to.have.property("error").with.eql('Unauthorized')
                    
                result = await requester.get("/api/products/").set('Accept', 'application/json').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`])                
                    
                    
                    
                    
                    expect(result.statusCode).to.be.eq(200)
                    expect(result._body.payload).to.be.an("array").and.to.not.empty


            })
            it("get /api/products/:pid devuelve un unico producto por id de producto solo a usuarios logueados ", async () => {
                

                    
                    let result = await requester.get("/api/products/${pid}").set('Accept', 'application/json')               
                console.log("🚀 ~ it ~ result.statusCode:", result.statusCode)
                                                          
                expect(result.statusCode).to.be.eq(401)
                expect(result._body).to.have.property("error").with.eql('Unauthorized')
                    
                result = await requester.get("/api/products/").set('Accept', 'application/json').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`])                
                    
                    
                    
                    
                    expect(result.statusCode).to.be.eq(200)
                    expect(result._body.payload).to.be.an("array").and.to.not.empty


            })
                console.log("🚀 ~ it ~ result._body:", result._body)




        })





    })



})