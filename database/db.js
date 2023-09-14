const mysql = require('mysql');
const conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'bdcine2'
})

conexion.connect((error)=>{
    if(error){
        console.error('El error de la conexion es: '+ error);
        return
    }
    console.log('¡Conectado a la base de datos!');
})

module.exports = conexion;