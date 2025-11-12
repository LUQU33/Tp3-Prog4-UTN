import express from 'express';
import { db } from './db.js';
import { verificarAutenticacion } from './auth.js';
import { validarId, verificarValidaciones } from './validaciones.js';
import { body } from 'express-validator';

const router = express.Router();

// Validacion de alumnos
const validacionAlumno = [
    body('nombre', 'El nombre es inválido o esta vacío').isAlpha('es-ES').notEmpty().isLength({ max:50 }),
    body('apellido', 'El apellido es inválido o esta vacío').isAlpha('es-ES').notEmpty().isLength({ max:50 }),
    body('dni', 'El DNI es inválido o esta vacío').isNumeric({ min: 1 }).notEmpty()
];

// Obtener todos los alumnos
router.get(
    '/',
    verificarAutenticacion,
    async (req, res) => {
        try {
            const [rows] = await db.execute('SELECT * FROM alumno');
            res.json({ success: true, alumnos: rows });
        } catch(error) {
            console.error('Error en GET /alumnos ->', error);
            res.status(500).json({ success: false, error: 'Error del servidor' });
        }
    });

// Obtener un alumno especifico
router.get(
    '/:id',
    verificarAutenticacion,
    validarId,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);

        try {
            const [rows] = await db.execute(
                'SELECT * FROM alumno WHERE id=?',
                [id]
            );

            if (rows.length === 0){
                return res
                .status(404)
                .json({ success: false, message: 'Alumno no encontrado' });
            }

            res.json({ success: true, alumno: rows[0] });
        } catch(error) {
            console.error('Error en GET /alumnos/:id ->', error);
            res.status(500).json({ success: false, error: 'Error del servidor' });
        }
    }
);

// Crear un nuevo alumno
router.post(
    '/',
    verificarAutenticacion,
    validacionAlumno,
    verificarValidaciones,
    async (req, res) => {
        const { nombre, apellido, dni } = req.body;

        try {
            // Validamos que el dni no exista
            const [alumnos] = await db.execute(
                'SELECT * FROM alumno WHERE dni=?',
                [dni]
            );
            if (alumnos.length > 0){
                return res
                .status(400)
                .json({ success: false, error: 'Ya existe un alumno con ese DNI' })
            }

            // En caso contrario, cargamos el alumno en la base de datos
            const [rows] = await db.execute(
                'INSERT INTO alumno (nombre, apellido, dni) VALUES (?,?,?)',
                [nombre, apellido, dni]
            );

            res.status(201).json({
                success: true,
                data: { id: rows.insertId, nombre, apellido, dni },
            });
        } catch(error) {
            console.error('Error en POST /alumnos ->', error);
            res.status(500).json({ success: false, error: 'Error del servidor' });
        }
    }
);

// Actualizar un alumno
router.put(
    '/:id',
    verificarAutenticacion,
    validarId,
    validacionAlumno,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);
        const { nombre, apellido, dni } = req.body;

        try {
            // Verificamos que el nuevo DNI no coincida con otro ya creado
            const [alumnos] = await db.execute(
                'SELECT * FROM alumno WHERE dni=? AND id!=?',
                [dni, id]
            );
            if (alumnos.length > 0){
                return res
                .status(400)
                .json({ success: false, error: 'El DNI ya existe en otro alumno' });
            }
            // Actualizamos el alumno
            const [result] = await db.execute(
                'UPDATE alumno SET nombre=?, apellido=?, dni=? WHERE id=?',
                [nombre, apellido, dni, id]
            );

            if (result.affectedRows === 0) {
                return res
                .status(404)
                .json({ success: false, message: 'Alumno no encontrado' })
            }

            res.json({
                success: true,
                data: { id, nombre, apellido, dni },
            });
        } catch(error) {
            console.error('Error en PUT /alumnos/:id ->', error);
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
                'DELETE FROM alumno WHERE id=?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res
                .status(404)
                .json({ success: false, message: 'Alumno no encontrado'})
            }

            res.json({ success: true, message: 'Alumno eliminado con éxito' });
        } catch(error) {
            console.error('Error en DELETE /alumnos/:id ->', error);
            res.status(500).json({ success: false, error: 'Error del servidor' });
        }
    }
);

export default router;