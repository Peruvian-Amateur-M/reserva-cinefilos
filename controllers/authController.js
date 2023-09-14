const bcryptjs = require("bcryptjs");

const conexion = require("../database/db");

const { promisify } = require("util");

//procedimiento para regirtrarnos

exports.register = async (req, res) => {
  try {
    const id = req.params.id;

    const fullname = req.body.fullName;

    const lastname = req.body.lastName;

    const phonenumber = req.body.phoneNumber;

    const username = req.body.userName;

    const email = req.body.email;

    const password = req.body.password;

    const rol = req.body.rol;

    let passHash = await bcryptjs.hash(password, 8);

    console.log(passHash);

    conexion.query(
      "INSERT INTO usuarios SET ?",
      {
        nombre: fullname,

        apellidos: lastname,

        celular: phonenumber,

        usuario: username,

        correo: email,

        password: passHash,

        rol: rol,
      },
      (error, results) => {
        if (error) {
          console.log(error);
        }

        res.redirect("/");
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id; // Asegúrate de obtener el ID de algún lugar (params, body, etc.)

    const nombre = req.body.nombre;

    const apellidos = req.body.apellidos;

    const celular = req.body.celular;

    const usuario = req.body.usuario;

    const correo = req.body.correo;

    const password = req.body.password;

    const rol = req.body.rol;

    const passHash = await bcryptjs.hash(password, 8); // Utiliza await para esperar la promesa

    conexion.query(
      "UPDATE usuarios SET ? WHERE id=?",

      [
        {
          nombre: nombre,
          apellidos: apellidos,
          celular: celular,
          usuario: usuario,
          correo: correo,
          password: passHash, // Usa el hash de la contraseña

          rol: rol,
        },
        id,
      ],
      (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.redirect("/users");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
