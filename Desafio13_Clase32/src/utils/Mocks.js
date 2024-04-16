import {faker} from '@faker-js/Faker'
faker.locale = "es"
export const generateListProducts = await  => {
    let numOfProducts = 100
    let products = []

    for (let i =0 ; i<numOfProducts; i++){
        products.push(generateProduct())
    }
}
export const generateProduct = await  => {
    
   return {
    
   }


}

