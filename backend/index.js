import express from 'express';
import cors from 'cors';
import { conectarDB } from './db.js';
import usuariosRouter from './usuarios.js';
import authRouter, { authConfig } from './auth.js'; 
import alumnosRouter from './alumnos.js';
import materiasRouter from './materias.js';
import notasRouter from './notas.js';

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
    res.send('Bienvenido a mi API del TP3 de PROG4!');
});

// Rutas de la API
app.use('/alumnos', alumnosRouter);
app.use('/auth', authRouter);
app.use('/materias', materiasRouter);
app.use('/notas', notasRouter)
app.use('/usuarios', usuariosRouter);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});