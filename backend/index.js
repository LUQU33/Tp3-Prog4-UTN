import express from 'express';
import cors from 'cors';
import { conectarDB } from './db';

conectarDB();

const app = express();
const port = 3000;

// Para interpretar body como JSON
app.use(express.json());

// Habilito CORS
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hola Mundo!');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});