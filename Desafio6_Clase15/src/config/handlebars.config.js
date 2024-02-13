import handlebars from "express-handlebars";
import __dirname from "../utils.js";

const handlebars_config = (app)=>{
    console.log("🚀 handlebars_config ~ __dirname:", __dirname)
    
    app.engine("handlebars", handlebars.engine());
    app.set("views", __dirname + "/views");
    app.set("view engine", 'handlebars');

}
export default handlebars_config