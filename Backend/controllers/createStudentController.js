const { studentValidatorSchema } = require('../validators/studentValidator.js');
const { pool } = require("../db/db_con.js");

const createStudent = async (req, res, next) => {
    try{
        const {error, value} = studentValidatorSchema.validate( req.body, {
            abortEarly: false
        });

        if(error){
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.details.map((err)=> err.message )
            });
        }

        const studentId = value.studentId || value.staudentid;
        const email = value.email;
        const contactNumber = value.contactNumber || value.contactnumber;
        const firstName = value.firstName || value.firstname;
        const lastName = value.lastName || value.lastname;
        const dateOfBirth = value.dateOfBirth || value.dateofbirth;
        const enrollmentDate = value.enrollmentDate || value.enrollmentdate;
        const status = value.status;
        const profilePicture = value.profilePicture || null

        //language=PostgreSQL
        const duplicateQuery = `
            SELECT "studentId", "email", "contactNumber" 
            FROM students 
            WHERE "studentId" = $1 OR LOWER(email) = LOWER($2) OR "contactNumber" = $3
            LIMIT 1
        `;
        const { rows: [existingStudents] } = await pool.query(duplicateQuery, [
            studentId,
            email,
            contactNumber,
        ]);

        if(existingStudents){
            let field = "Data Value";
            if(String(existingStudents.studentId) === value.studentId ){
                field = "studentId";
            }else if(String(existingStudents.email) === value.email){
                field = "email"
            }else if(String(existingStudents.contactNumber) === value.contactNumber){
                field = "contactNumber"
            }
            return res.status(409).json({
                success: false,
                message: `Student with the ${field} already exists`,
            })
        }

        //language=PostgreSQL
        const insertQuery = `
            INSERT INTO students (
                "studentId", "firstName", "lastName", "email",
                "dateOfBirth", "contactNumber", "enrollmentDate",
                "status", "profilePicture")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING 
                "studentId", "firstName", "lastName", "email",
                "dateOfBirth", "contactNumber", "enrollmentDate",
                "status", "profilePicture"
        `;
        const { rows: [newStudent] } = await pool.query(insertQuery, [
            studentId,
            firstName,
            lastName,
            email,
            dateOfBirth,
            contactNumber,
            enrollmentDate,
            status,
            profilePicture || null
        ]);
        return res.status(200).json({
            success: true,
            message: "Student created successfully",
            data: newStudent
        });
    }catch(error){
        next(error);
    }
}

module.exports = { createStudent };