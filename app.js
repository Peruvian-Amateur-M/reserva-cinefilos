const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcryptjs = require("bcryptjs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs"); // Configura el motor de vistas (ejs en este ejemplo)
app.set("views", path.join(__dirname, "views")); // Establece la ubicación de las vistas

app.engine("pug", require("pug").__express);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({ secret: "your-secret-key", resave: false, saveUninitialized: true })
);

app.get("/", (req, res) => {
  res.render("Usuarios/Login"); // Renderiza la vista login.ejs
});

app.post("/login", async (req, res) => {
  const { correo, password } = req.body;
  const query = "SELECT password FROM usuarios WHERE correo = ?";

  conexion.query(query, [correo], async (error, results) => {
    if (error) {
      throw error;
    }

    if (results.length === 1) {
      const storedHash = results[0].password;

      // Comparar la contraseña proporcionada con el hash almacenado
      const isPasswordCorrect = await bcryptjs.compare(password, storedHash);

      if (isPasswordCorrect) {
        console.log("Inicio de sesión exitoso");
        res.render("principal", {
          message: "Inicio de sesión exitoso",
        });
      } else {
        console.log("Credenciales incorrectas");
        res.render("Usuarios/login", { message: "Credenciales incorrectas" });
      }
    } else {
      console.log("Usuario no encontrado");
      res.render("Usuarios/login", { message: "Credenciales incorrectas" });
    }
  });
});

app.use(cors());

const router = require("./router");
const conexion = require("./database/db");
app.use("/", router);

app.listen(8090, () => {
  console.log("Corriendo en el puerto 8090");
});
