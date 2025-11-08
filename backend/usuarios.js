import express from 'express';
import { db } from './db.js';
import { validarId, verificarValidaciones } from './validaciones.js';
import { body, param } from 'express-validator';
import bcrypt from 'bcrypt';
import { verificarAutenticacion } from './auth.js';

const router = express.Router();

// Obtenemos todos los usuarios
router.get('/', verificarAutenticacion, async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM usuario');
    // RECORDAR Eliminar contraseña en la api
    res.json({
        success: true,
        usuarios: rows.map((u) => ({ ...u, password_hash: undefined })),
    });
});

// Obtener usuario por ID
router.get(
    '/:id',
    verificarAutenticacion,
    validarId,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);
        const [rows] = await db.execute(
            'SELECT id, nombre, email FROM usuario WHERE id=?',
            [id]
        );

        if (rows.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'Usuario no encontrado' });
        }

        res.json({ success: true, usuario: rows[0] });
    }
);

// Crear un nuevo usuario
router.post(
    '/',
    body('nombre', 'Nombre de usuario inválido').isAlphanumeric('es-ES').isLength({ max:20 }),
    body('email', 'Email inválido').isEmail(),
    body('contraseña', 'Contraseña inválida').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }),
    verificarValidaciones,
    async (req, res) => {
        const { nombre, email, contraseña } = req.body;

        // Creamos Hash de la contraseña con bcrypt
        const hashedPassword = await bcrypt.hash(contraseña, 12);

        const [result] = await db.execute(
            'INSERT INTO usuario (nombre, email, contraseña) VALUES (?,?,?)',
            [nombre, email, hashedPassword]
        );

        res.status(201).json({
            success: true,
            data: { id: result.insertId, nombre, email },
        });
    }
);

export default router;