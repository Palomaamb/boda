const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Endpoint para guardar datos
app.post('/guardar', (req, res) => {
    const data = req.body;

    // Guardar en un archivo JSON o base de datos (ejemplo simple con JSON)
    fs.appendFile('responses.json', JSON.stringify(data) + '\n', (err) => {
        if (err) {
            console.error('Error guardando los datos:', err);
            res.status(500).send('Error al guardar los datos');
        } else {
            res.send('Datos guardados correctamente');
        }
    });
});

// Servir archivos estáticos
app.use(express.static('public'));

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
