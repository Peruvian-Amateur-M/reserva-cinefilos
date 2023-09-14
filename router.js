const express = require("express");
const router = express.Router();
const conexion = require("./database/db");

// ... Código previo ...

// RUTA PARA MOSTRAR LAS PELICULAS
router.get("/peliculas", (req, res) => {
  conexion.query("SELECT * FROM Pelicula", (error, results) => {
    if (error) {
      throw error;
    } else {
      const peliculas = results;
      res.render("peliculas/ListaPeliculas", { peliculas: peliculas });
    }
  });
});

// RUTA PARA MOSTRAR LA PÁGINA DE ASIENTOS DISPONIBLES DE UNA PELICULA
router.get("/peliculas/:id/asientos", (req, res) => {
  const peliculaId = req.params.id;

  // Aquí podrías realizar alguna lógica para verificar si la película con el ID proporcionado existe en la base de datos.

  // Redirigimos a la página de asientos con el ID de la película como parámetro
  res.redirect(`/asientos/seleccion/${peliculaId}`);
});

// Función para obtener información de una película por su ID
function obtenerPeliculaPorId(peliculaId, callback) {
  conexion.query(
    "SELECT * FROM Pelicula WHERE Id_pelicula = ?",
    [peliculaId],
    (error, results) => {
      if (error) {
        return callback(error, null);
      } else {
        const pelicula = results[0]; // Suponiendo que obtienes solo un resultado
        return callback(null, pelicula);
      }
    }
  );
}
// RUTA PARA MOSTRAR LA PÁGINA DE SELECCIÓN DE ASIENTOS
router.get("/asientos/seleccion/:peliculaId", (req, res) => {
  const peliculaId = req.params.peliculaId;

  // Llamamos a la función para obtener la información de la película por su ID
  obtenerPeliculaPorId(peliculaId, (error, pelicula) => {
    if (error) {
      // Manejo del error
      throw error;
    } else {
      // Aquí ya tienes la información de la película en la variable "pelicula"

      // Lógica para obtener los asientos disponibles de la película con id peliculaId
      conexion.query(
        "SELECT * FROM Asiento WHERE Id_asiento IN (SELECT Id_asiento FROM Asiento_Pelicula WHERE Id_pelicula = ?)",
        [peliculaId],
        (error, results) => {
          if (error) {
            throw error;
          } else {
            const asientos = results;
            // Asegúrate de que la variable "pelicula" esté definida y tenga un valor válido antes de renderizar la vista.
            // Puedes utilizar un condicional para asegurarte de que la variable tenga valor antes de acceder a sus propiedades.
            if (pelicula) {
              res.render("Butacas/ListaAsientos", {
                pelicula: pelicula,
                asientos: asientos,
              });
            } else {
              // Manejar el caso en que no se encuentre la película por el Id
              res.send("Película no encontrada");
            }
          }
        }
      );
    }
  });
});

// Función para obtener detalles de asientos por su lista de IDs
function obtenerDetallesAsientos(asientosIds, callback) {
  conexion.query(
    "SELECT * FROM Asiento WHERE Id_asiento IN (?)",
    [asientosIds],
    (error, results) => {
      if (error) {
        return callback(error, null);
      } else {
        return callback(null, results);
      }
    }
  );
}

router.get("/sala/registrarSalas", (req, res) => {
  res.render("Salas/RegistrarSalas");
});

router.get("/sala/editar/:id", (req, res) => {
  const id = req.params.id;
  conexion.query(
    "SELECT * FROM Salas WHERE Id_sala=?",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render("Salas/EditarSalas", { Salas: results[0] });
      }
    }
  );
});

router.get("/sala/delete/:id", (req, res) => {
  const id = req.params.id; // Cambia a req.params.id
  conexion.query(
    "DELETE FROM Salas WHERE Id_sala=?",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.redirect("/sala");
      }
    }
  );
});

router.get("/sala", (req, res) => {
  conexion.query("SELECT*FROM Salas", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("Salas/ListarSalas", { results: results });
    }
  });
});

router.get("/pago", (req, res) => {
  const pelicula = req.query.pelicula;

  const detallesAsientosStr = req.query.asientos;

  console.log("Detalles de Asientos recibidos:", detallesAsientosStr);
  console.log("peliculaId:", pelicula);

  try {
    const detallesAsientos = JSON.parse(detallesAsientosStr);

    // Obtener los detalles de la película desde la base de datos
    obtenerPeliculaPorId(pelicula, (error, pelicula) => {
      if (error) {
        console.error("Error al obtener los detalles de la película:", error);
        // Manejar el error adecuadamente
        return;
      }

      // Renderizar la página de pago con los datos necesarios
      res.render("Pago/RealizarPago", { pelicula, detallesAsientos });
    });
  } catch (error) {
    console.error("Error al analizar detalles de asientos:", error);
    // Manejar el error adecuadamente
  }
});

router.get("/mostrarBoleta", (req, res) => {
  const pelicula = req.query.pelicula; // Cambio en el nombre del parámetro

  const detallesAsientosStr = req.query.asientos;

  console.log("Detalles de Asientos recibidos:", detallesAsientosStr);
  console.log("pelicula:", pelicula); // Cambio en el nombre del parámetro

  try {
    const detallesAsientos = JSON.parse(detallesAsientosStr);

    // Obtener los detalles de la película por su ID numérico desde la base de datos
    obtenerPeliculaPorId(pelicula, (error, pelicula) => {
      if (error) {
        console.error("Error al obtener los detalles de la película:", error);
        // Manejar el error adecuadamente
        return;
      }

      // Renderizar la página de boleta con los datos necesarios
      res.render("Pago/DocumentoPago", { pelicula, detallesAsientos });
    });
  } catch (error) {
    console.error("Error al analizar detalles de asientos:", error);
    // Manejar el error adecuadamente
  }
});

// RUTA PARA MOSTRAR LA PÁGINA DE CONFIRMACIÓN
router.post("/asientos/confirmacion", (req, res) => {
  const peliculaId = req.body.peliculaId;
  const asientosSeleccionados = req.body.asientosSeleccionados; // Un array de IDs de asientos seleccionados

  obtenerPeliculaPorId(peliculaId, (error, pelicula) => {
    if (error) {
      throw error;
    } else {
      // Aquí ya tienes la información de la película en la variable "pelicula"

      // Lógica para obtener los detalles de los asientos seleccionados por sus IDs
      obtenerDetallesAsientos(
        asientosSeleccionados,
        (error, detallesAsientos) => {
          if (error) {
            throw error;
          } else {
            console.log("Detalles de Asientos:", detallesAsientos);
            // Renderizamos la página de confirmación y pasamos la información de la película y los detalles de los asientos
            res.render("Peliculas/Confirmacion", {
              pelicula: pelicula,
              detallesAsientos: detallesAsientos,
            });
          }
        }
      );
    }
  });
});

//ruta para traer todos los usuarios

router.get("/users", (req, res) => {
  conexion.query("SELECT * FROM usuarios", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("Usuarios/ListarUsuarios", { results: results });
    }
  });
});

router.get("/updateregister/:id", (req, res) => {
  const id = req.params.id;
  const consulta = "SELECT * FROM usuarios WHERE id = ?";
  conexion.query(consulta, [id], (err, resultado) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return;
    }
    res.render("Usuarios/EditarUsuarios", { user: resultado[0] });
  });
});

router.get("/peliculas/editar/:id", (req, res) => {
  const id = req.params.id;
  conexion.query(
    "SELECT * FROM Pelicula WHERE Id_pelicula=?",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render("Peliculas/EditarPeliculas", { peliculas: results[0] });
      }
    }
  );
});

router.get("/register", (req, res) => {
  res.render("Usuarios/RegistrarUsuarios");
});

const crudUsuarios = require("./controllers/authController");
router.post("/update/:id", crudUsuarios.update);
router.post("/register", crudUsuarios.register);

router.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  conexion.query("DELETE FROM usuarios WHERE id=?", [id], (error, results) => {
    if (error) {
      throw error;
    } else {
      res.redirect("/users");
    }
  });
});

router.get("/login", (req, res) => {
  res.render("Usuarios/Login");
});

router.get("/peliculas/create", (req, res) => {
  res.render("Peliculas/RegistrarPeliculas");
});

const crudPeliculas = require("./controllers/crudPeliculas");
router.post("/peliculas/update", crudPeliculas.update);
router.post("/peliculas/save", crudPeliculas.save);

const crud = require("./controllers/crudSalas");
router.post("/sala/save", crud.save);
router.post("/sala/update", crud.update);

router.post("/realizar-compra", (req, res) => {
  res.json({ success: true });
});

module.exports = router;
