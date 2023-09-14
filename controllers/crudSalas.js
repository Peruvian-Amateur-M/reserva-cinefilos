const conexion = require("../database/db");

exports.save = (req, res) => {
  const asientos = req.body.asientos;
  const descripcion = req.body.descripcion;
  const estado = req.body.estado;
  conexion.query(
    "INSERT INTO Salas SET ?",
    { asientos: asientos, descripcion: descripcion, estado: estado },
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/sala");
      }
    }
  );
};

exports.update = (req, res) => {
  const id = req.body.id;
  const asientos = req.body.asientos;
  const descripcion = req.body.descripcion;
  const estado = req.body.estado;

  console.log("Valores de actualización recibidos:");
  console.log("ID:", id);
  console.log("Asientos:", asientos);
  console.log("Descripción:", descripcion);
  console.log("Estado:", estado);

  conexion.query(
    "UPDATE Salas SET ? WHERE Id_sala=?",
    [{ asientos: asientos, descripcion: descripcion, estado: estado }, id],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Actualización exitosa.");
        res.redirect("/sala");
      }
    }
  );
};
