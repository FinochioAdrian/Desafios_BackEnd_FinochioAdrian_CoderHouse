import passport from "passport";
import local from "passport-local";
import UsersDAO from "../feature/users/users.dao.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";
const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email } = req.body;
        let age = parseInt(req.body.age);
        if (
          !username ||
          !first_name ||
          !last_name ||
          !email ||
          !age ||
          !password
        ) {
          return done(null, false, {
            type: "errorEmptyField",
            message: "Oops! It looks like you missed a few fields.",
          });
        }

        try {
          let emailUsed = await UsersDAO.getUserByEmail(username);

          if (emailUsed) {
            return done(null, false, {
              type: "errorValidation",
              message: "The email address you entered is already in use.",
            });
          }

          const user = {
            first_name,
            last_name,
            age,
            email,
            password: createHash(password),
            role: "user",
          };
          const result = await UsersDAO.insert(user);
          return done(null, result);
        } catch (error) {
          console.log("❌ ~ error:", error);
          return done("Error al registrar el usuario: " + error);
        }
      }
    )
  );
  // Verificar credencial
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UsersDAO.getUserByID(id);
      done(null, user);
    } catch (e) {
      console.log("No se pudo obtener el usuario", e);
      done(e, null);
    }
  });

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await UsersDAO.getUserByEmail(username);

          if (!user) {
            console.log("Usuario no encontrado");
            return done(null, false, {
              type: "errorValidation",
              message:
                "No account exists with the email address or username you entered",
            });
          }
          if (!isValidPassword(user, password)) {
            console.log("Password incorrecto ");

            return done(null, false, {
              type: "errorValidation",
              message: "Incorrect password",
            });
          }

          return done(null, user);
        } catch (error) {
          console.log("❌ ~ passport.use ~ error:", error);
          return done(error);
        }
      }
    )
  );
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.ce213734327e0267",

        clientSecret: "d0b6c830edab5eab76846956da57f3f1fe9d35b6",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          /* console.log(profile); */
          let username = profile._json.id + profile._json.login + "@github.com";
          // la doble validación es por si el usuario coloco su email en public en github
          let user = await UsersDAO.getUserByEmail(username);
           
          if (!user){
            user = await UsersDAO.getUserByEmail(profile._json.email);
          } 

          if (!user) {
            
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 18,
              email: username,
              password: "",
              role: "user",
            };
            const userInsert = await UsersDAO.insert(newUser);
            
            done(null, userInsert);
          } else {
            done(null, user);
          }
        } catch (error) {
          console.log("❌ ~ error:", error);

          return done(error);
        }
      }
    )
  );
};

export default initializePassport;
