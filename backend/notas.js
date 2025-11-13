import express from "express";
import { db } from "./db.js";
import { verificarAutenticacion } from "./auth.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";

const router = express.Router();

// Validacion de notas (CREAR)
const validacionNotaPOST = [
    body('alumno_id', 'Id de alumno inválido o vacío').isInt({ min: 1}),
    body('materia_id', 'Id de materia inválido o vacío').isInt({ min: 1}),
    body('nota1', 'La nota debe ser un número entre 1 y 10').isFloat({ min: 1, max:10 }).optional({ nullable: true }),
    body('nota2', 'La nota debe ser un número entre 1 y 10').isFloat({ min: 1, max:10 }).optional({ nullable: true }),
    body('nota3', 'La nota debe ser un número entre 1 y 10').isFloat({ min: 1, max:10 }).optional({ nullable: true })
];

// Validacion de notas (Actualizar)
const validacionNotaPUT = [
    body('nota1', 'La nota debe ser un número entre 1 y 10').isFloat({ min: 1, max:10 }).optional({ nullable: true }),
    body('nota2', 'La nota debe ser un número entre 1 y 10').isFloat({ min: 1, max:10 }).optional({ nullable: true }),
    body('nota3', 'La nota debe ser un número entre 1 y 10').isFloat({ min: 1, max:10 }).optional({ nullable: true })
];

// Obtener todas las notas con su respectiva materia y alumno
router.get(
    '/',
    verificarAutenticacion,
    async (req, res) => {
        try {
            const [rows] = await db.execute(
                `SELECT 
                n.id, 
                n.alumno_id, 
                a.nombre AS alumno_nombre, 
                a.apellido AS alumno_apellido, 
                n.materia_id, 
                m.nombre AS materia_nombre, 
                n.nota1, 
                n.nota2, 
                n.nota3 
                FROM nota n 
                JOIN alumno a ON n.alumno_id = a.id 
                JOIN materia m ON n.materia_id = m.id`
            );
            
            res.json({ success: true, notas: rows })
        } catch(error){
            console.error("Error en GET /notas ->", error);
            res.status(500).json({ success: false, error: "Error del servidor" });
        }
    });

// Obtener notas por id
router.get(
    '/:id',
    verificarAutenticacion,
    validarId,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);

        try {
            const [rows] = await db.execute(
                `SELECT 
                n.id, 
                n.alumno_id, 
                a.nombre AS alumno_nombre, 
                a.apellido AS alumno_apellido, 
                n.materia_id, 
                m.nombre AS materia_nombre, 
                n.nota1, 
                n.nota2, 
                n.nota3 
                FROM nota n 
                JOIN alumno a ON n.alumno_id = a.id 
                JOIN materia m ON n.materia_id = m.id
                WHERE n.id=?`,
                [id]
            );

            if (rows.length === 0) {
                return res
                .status(404)
                .json({ success: false, message: "Registro de notas no encontrado" })
            }
            
            res.json({ success: true, notas: rows[0] })
        } catch(error){
            console.error("Error en GET /notas/:id ->", error);
            res.status(500).json({ success: false, error: "Error del servidor" });
        }
    });

// Crear un nuevo registro de notas
router.post(
    '/',
    verificarAutenticacion,
    validacionNotaPOST,
    verificarValidaciones,
    async (req, res) => {
        // Las notas tienen la posibilidad de ser almacenadas como null (opcionales)
        const { alumno_id, materia_id, nota1 = null, nota2 = null, nota3 = null } = req.body;

        try {
            // Verificamos que no exista un registro de este mismo alumno en esta misma materia
            const [registro] = await db.execute(
                'SELECT * FROM nota WHERE alumno_id =? AND materia_id =?',
                [alumno_id, materia_id]
            );

            if (registro.length > 0) {
                return res
                .status(400)
                .json({ success: false, error: 'Este alumno ya posee un registro de notas para esta materia' })
            }

            // En caso contrario, cargamos el nuevo registro en la base de datos
            const [result] = await db.execute(
                'INSERT INTO nota (alumno_id, materia_id, nota1, nota2, nota3) VALUES (?,?,?,?,?)',
                [alumno_id, materia_id, nota1, nota2, nota3]
            );

            res.status(201).json({ success: true, data: { id: result.insertId, alumno_id, materia_id, nota1, nota2, nota3 }});
        } catch(error) {
            console.error("Error en POST /notas ->", error);
            res.status(500).json({ success: false, error: "Error del servidor" });
        }
    }
);

// Actualizar un registro de notas
router.put(
    '/:id',
    verificarAutenticacion,
    validarId,
    validacionNotaPUT,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);
        const { nota1 = null, nota2 = null, nota3 = null } = req.body;

        try {
            const [result] = await db.execute(
                'UPDATE nota SET nota1 =?, nota2 =?, nota3 =? WHERE id=?',
                [nota1, nota2, nota3, id]
            );

        if (result.affectedRows === 0) {
            return res
            .status(404)
            .json({ success: false, message: 'No se encontró el registro de notas' })
        }

        res.json({ success: true, data: { id, nota1, nota2, nota3 }});
        } catch(error) {
            console.error("Error en PUT /notas/:id ->", error);
            res.status(500).json({ success: false, error: "Error del servidor" });
        }
    }
);

// Borrar un registro de notas
router.delete(
    '/:id',
    verificarAutenticacion,
    validarId,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);
        try {
            const [result] = await db.execute(
                'DELETE FROM nota WHERE id=?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res
                .status(404)
                .json({ success: false, message: 'No se encontró el registro de notas'})
            }

            res.json({ success: true, message: 'Registro de notas eliminado con éxito' });
        } catch(error) {
            console.error("Error en DELETE /notas/:id ->", error);
            res.status(500).json({ success: false, error: "Error del servidor" });
        }
    }
)

export default router;