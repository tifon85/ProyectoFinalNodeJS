import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { google_client_id, google_client_secret, github_client_id, github_client_secret, secret_jwt  } from "../config/dotenv.config.js"
import { UserService } from "../services/UserService.js";
import { CartService } from "../services/CartService.js";

const cartService = new CartService()
const userService = new UserService()

passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        const { first_name, last_name } = req.body;
        if (!first_name || !last_name || !email || !password) {
          return done(null, false, { message: "All fields are required" });
        }
        try {
            const user = await userService.getUserByEmailService(email)
            if(!user){
                //no existe el usuario, entonces lo registramos
                const cartID = await cartService.createCartService()
                const role =
                        email === "adminCoder@coder.com" && password === "adminCod3r123"
                        ? "ADMIN"
                        : "USUARIO"
                const user = {
                  first_name: first_name,
                  last_name: last_name,
                  email: email,
                  password: password,
                  role: role,
                  cart: cartID
                }
                const createdUser = await userService.registerUserService(user)
                return done(null, createdUser, { message: "User created"});
            }else{
                //ya existe el usuario
                return done(null,false, { message: "User already exist"})
            }
        } catch (error) {
            done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        if (!email || !password) {
            //no pueden venir vacios estos campos, son obligatorios
            return done(null, false, { message: "All fields are required" });
        }
        try {
          const user = await userService.getUserByEmailService(email);
          if (!user) {
            //no existe el usuario
            return done(null, false, { message: "Incorrect email or password." });
          }
          const PasswordValid = await userService.isPasswordValidService(password, user.password);
          if (!PasswordValid) {
            //no es correcta la password
            return done(null, false, { message: "Incorrect email or password." });
          }else{
            return done(null, user);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

// github
passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: github_client_id,
        clientSecret: github_client_secret,
        callbackURL: "http://localhost:8080/api/sessions/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          //Si el email es publico, lo registro con el email
          if(profile._json.email){
            const userDB = await userService.getUserByEmailService(profile._json.email);
            // login
            if (userDB) {
              if (userDB.isGithub) {
                return done(null, userDB);
              } else {
                return done(null, false);
              }
            }
            //no existe el usuario, entonces lo registramos
            // signup
            const cartID = await cartService.createCartService()
            const user = {
              first_name: profile._json.name.split(" ")[0] || "Usuario Github",// ['farid','sesin']
              last_name: profile._json.name.split(" ")[1] || profile.username,
              email: profile._json.email,
              password: " ",
              role: "USUARIO",
              cart: cartID,
              isGithub: true
            }
            const createdUser = await userService.registerUserService(user)
            return done(null, createdUser);
          }else{
            //si el email es privado, lo registro con el ID de github en lugar del email
            const userDB = await userService.getUserByEmailService(profile.id);
            // login
            if (userDB) {
              if (userDB.isGithub) {
                return done(null, userDB);
              } else {
                return done(null, false);
              }
            }
            // signup
            const cartID = await cartService.createCartService()
            const user = {
              first_name: "Usuario Github",
              last_name: profile.username,
              email: profile.id,
              password: " ",
              role: "USUARIO",
              cart: cartID,
              isGithub: true
            }
            const createdUser = await userService.registerUserService(user)
            return done(null, createdUser);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // google

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: google_client_id,
      clientSecret: google_client_secret,
      callbackURL: "http://localhost:8080/api/sessions/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const userDB = await userService.getUserByEmailService(profile._json.email);
        // login
        if (userDB) {
          if (userDB.isGoogle) {
            return done(null, userDB);
          } else {
            return done(null, false);
          }
        }
        // signup
        const cartID = await cartService.createCartService()
            const user = {
              first_name: profile._json.given_name,
              last_name: profile._json.family_name,
              email: profile._json.email,
              password: " ",
              role: "USUARIO",
              cart: cartID,
              isGoogle: true
            }
        const createdUser = await userService.registerUserService(user)
        return done(null, createdUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

//funcion que retorna el token --> se utiliza en JWTStrategy
const fromCookies = (req) => {
  if(req.headers.cookie){
    return req.headers.cookie.replace('token=', '');
  }else{
    return null
  }
};

// JWT --> para recuperar la info del usuario
passport.use(
  "jwt",
  new JWTStrategy(
    {
      /*jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),*/
      jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
      secretOrKey: secret_jwt,
    },
    async function (jwt_payload, done) {
      try{
        return done(null, jwt_payload);
      } catch (error) {
        return done(error)
      }
    }
  )
);

  passport.serializeUser((user, done) => {
    // _id
    return done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userService.getUserByIdService(id);
      return done(null, user);
    } catch (error) {
      done(error);
    }
  });