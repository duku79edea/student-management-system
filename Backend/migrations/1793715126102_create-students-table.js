const shorthands = undefined;

const up = (pgm) => {
    pgm.createTable("students", {
        id: {
            type: "bigserial",
            primaryKey: true
        },
        studentId: {
            type: "varchar(50)",
            notNull: true,
            unique: true
        },
        firstName: {
            type: "varchar(50)",
            notNull: true
        },
        lastName: {
            type: "varchar(50)",
            notNull: true
        },
        email: {
            type: "varchar(255)",
            notNull: true,
            unique: true
        },
        dateOfBirth: {
            type: "date",
            notNull: true
        },
        contactNumber: {
            type: "varchar(50)",
            notNull: true,
            unique: true
        },
        enrollmentDate: {
            type: "date",
            notNull: true
        },
        status: {
            type: "varchar(15)",
            notNull: true,
            default: "Active"
        },
        profilePicture: {
            type: "text",
        },
        created_at: {
            type: "timestamp with time zone",
            notNull: true,
            default: pgm.func("current_timestamp")
        }
    });

    pgm.addConstraint("students", "check_students_status", {
        check:  "status IN ('Active', 'Inactive', 'Graduated')"
    })
};

const down = (pgm) => {
    pgm.dropTable("students");
};

module.exports = { shorthands, up, down };