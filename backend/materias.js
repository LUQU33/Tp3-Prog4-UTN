import express from 'express';
import { db } from './db.js';
import { verificarAutenticacion } from './auth.js';
import { validarId, verificarValidaciones } from './validaciones.js';
import { body } from 'express-validator';

const router = express.Router();

// Validacion de materias
const validacionMateria = [
    body('nombre', 'El nombre es inválido o esta vacío').isAlpha('es-ES').notEmpty().isLength({ max:50 }),
    body('codigo', 'El código debe tener 8 caracteres').isAlphanumeric('es-ES').notEmpty().isLength({ min:8, max:8 }),
    body('año', 'El año es inválido o esta vacío').isInt({ min: 1 }).notEmpty()
];

// Obtener todas las materias
router.get(
    '/',
    verificarAutenticacion,
    async (req , res) => {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM materia'
            );
            res.json({ success: true, alumnos: rows });
        } catch(error) {
            console.error('Error en GET /materias ->', error);
            res.status(500).json({ success: false, error: 'Error del servidor' });
        }
    });

// Obtener una materia especifica
router.get(
    '/:id',
    verificarAutenticacion,
    validarId,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);

        try {
            const [rows] = await db.execute(
                'SELECT * FROM materia WHERE id=?',
                [id]
            );

            if (rows.length === 0){
                return res
                .status(404)
                .json({ success: false, message: 'Materia no encontrada ' });
            }

            res.json({ success: true, alumno: rows[0] });
        } catch(error) {
            console.error('Error en GET /materias/:id ->', error);
            res.status(500).json({ success: false, error: 'Error del servidor' });
        }
    }
);

// Crear una materia nueva
router.post(
    '/',
    verificarAutenticacion,
    validacionMateria,
    verificarValidaciones,
    async (req, res) => {
        const { nombre, codigo, año } = req.body;

        try {
            // Validamos que el codigo no se repita
            const [materias] = await db.execute(
                'SELECT * FROM materia WHERE codigo=?',
                [codigo]
            );

            if (materias.length > 0){
                return res
                .status(400)
                .json({ success: false, error: 'Ya existe una materia con ese codigo' })
            }

            // En caso contrario, cargamos la materia en la base de datos
            const [rows] = await db.execute(
                'INSERT INTO materia (nombre, codigo, año) VALUES (?,?,?)',
                [nombre, codigo, año]
            );

            res.status(201).json({
                success: true,
                data: { id: rows.insertId, nombre, codigo, año },
            });
        } catch(error) {
            console.error('Error en POST /materias ->', error);
            res.status(500).json({ success: false, error: 'Error del servidor' });
        }
    }
);

// Actualizar una materia
router.put(
    '/:id',
    verificarAutenticacion,
    validarId,
    validacionMateria,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);
        const { nombre, codigo, año } = req.body;

        try {
            // Verificamos que el nuevo codigo no coincida con otro ya creado
            const [materias] = await db.execute(
                'SELECT * FROM materia WHERE codigo=? AND id!=?',
                [codigo, id]
            );
            if (materias.length > 0){
                return res
                .status(400)
                .json({ success: false, error: 'El codigo ya existe en otra materia' });
            }
            // Actualizamos la materia
            const [result] = await db.execute(
                'UPDATE materia SET nombre=?, codigo=?, año=? WHERE id=?',
                [nombre, codigo, año, id]
            );

            if (result.affectedRows === 0) {
                return res
                .status(404)
                .json({ success: false, message: 'Materia no encontrada' })
            }

            res.json({
                success: true,
                data: { id, nombre, codigo, año },
            });
        } catch(error) {
            console.error('Error en PUT /materias/:id ->', error);
            res.status(500).json({ success: false, error: 'Error del servidor' });
        }
    }
);

// Eliminar un alumno
router.delete(
    '/:id',
    verificarAutenticacion,
    validarId,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);

        try {
            const [result] = await db.execute(
                'DELETE FROM materia WHERE id=?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res
                .status(404)
                .json({ success: false, message: 'Materia no encontrada'})
            }

            res.json({ success: true, message: 'Materia eliminada con éxito' });
        } catch(error) {
            console.error('Error en DELETE /materia/:id ->', error);
            res.status(500).json({ success: false, error: 'Error del servidor' });
        }
    }
);

export default router;