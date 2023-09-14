const conexion = require('../database/db');

exports.save = (req,res)=>{

   const Id_asientos = req.body.Id_asientos;
   const NumeroAsiento = req.body.NumeroAsiento;
   

   conexion.query("INSERT INTO asientos SET ?",{Id_asientos:Id_asientos
                                                ,NumeroAsiento:NumeroAsiento
                                                },(error,result)=>{
                                                   if(error){
                                                      console.log("Hubo un error en la base de datos")
                                                   } else{
                                                      res.redirect("/");
                                                   }
                                                })
}

