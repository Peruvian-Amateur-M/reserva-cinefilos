const conexion = require("../database/db");

exports.save = (req, res) => {
  const { Titulo, Duracion, Genero, Clasificacion, Portada } = req.body;

  const Estado = "Activa"; // Por defecto, puedes ajustar según tus necesidades

  const sql =
    "INSERT INTO pelicula (Titulo, Duracion, Genero, Clasificacion, Portada, Estado) VALUES (?, ?, ?, ?, ?, ?)";

  conexion.query(
    sql,
    [Titulo, Duracion, Genero, Clasificacion, Portada, Estado],
    (error, result) => {
      if (error) {
        console.log("Hubo un error en la base de datos", error);
        res.status(500).json({ error: "Hubo un error en la base de datos" });
      } else {
        res.redirect("/peliculas"); // Redirige a la lista de películas después de guardar
      }
    }
  );
};

exports.update = (req, res) => {
  const id = req.body.id;
  const titulo = req.body.titulo;
  const duracion = req.body.duracion;
  const genero = req.body.genero;
  const clasificacion = req.body.clasificacion;
  const portada = req.body.portada;
  const estado = req.body.estado;

  console.log("Valores de actualización recibidos:");
  console.log("ID:", id);
  console.log("Título:", titulo);
  console.log("Duración:", duracion);
  console.log("Género:", genero);
  console.log("Clasificación:", clasificacion);
  console.log("Portada:", portada);
  console.log("Estado:", estado);

  conexion.query(
    "UPDATE Pelicula SET ? WHERE Id_pelicula=?",
    [
      {
        Titulo: titulo,
        Duracion: duracion,
        Genero: genero,
        Clasificacion: clasificacion,
        Portada: portada,
        Estado: estado,
      },
      id,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Hubo un error en la base de datos" });
      } else {
        console.log("Actualización exitosa.");
        res.redirect("/peliculas");
      }
    }
  );
};
