import express from 'express';
import cors from 'cors';
import { conectarDB } from './db.js';
import usuariosRouter from './usuarios.js';
import authRouter, { authConfig } from './auth.js'; 

conectarDB();

const app = express();
const port = 3000;

// Para interpretar body como JSON
app.use(express.json());

// Habilito CORS
app.use(cors());

authConfig();

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send('Hola Mundo!');
});

// Rutas de la API
app.use('/usuarios', usuariosRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});