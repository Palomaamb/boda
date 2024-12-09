const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Configurar middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Conectar o crear base de datos SQLite
const db = new sqlite3.Database('guests.db', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Crear tabla si no existe
const createTableQuery = `CREATE TABLE IF NOT EXISTS guests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    allergies TEXT,
    comments TEXT
)`;
db.run(createTableQuery, (err) => {
    if (err) {
        console.error('Error al crear la tabla:', err);
    } else {
        console.log('Tabla creada o ya existente.');
    }
});

// Ruta para recibir datos del formulario
app.post('/submit-form', (req, res) => {
    const { name, email, allergies, comments } = req.body;

    const insertQuery = `INSERT INTO guests (name, email, allergies, comments) VALUES (?, ?, ?, ?)`;
    db.run(insertQuery, [name, email, allergies, comments], function (err) {
        if (err) {
            console.error('Error al insertar datos:', err);
            res.status(500).send('Error al guardar los datos.');
        } else {
            console.log('Datos guardados:', { name, email, allergies, comments });
            res.send('<h1>¡Gracias! Tus datos han sido guardados.</h1><a href="/">Volver</a>');
        }
    });
});

// Ruta para visualizar los datos (solo para ti)
app.get('/view-guests', (req, res) => {
    const selectQuery = `SELECT * FROM guests`;
    db.all(selectQuery, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener datos:', err);
            res.status(500).send('Error al obtener datos.');
        } else {
            let html = '<h1>Lista de Invitados</h1><table border="1"><tr><th>Nombre</th><th>Email</th><th>Alergias</th><th>Comentarios</th></tr>';
            rows.forEach(row => {
                html += `<tr><td>${row.name}</td><td>${row.email}</td><td>${row.allergies}</td><td>${row.comments}</td></tr>`;
            });
            html += '</table><a href="/">Volver</a>';
            res.send(html);
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
