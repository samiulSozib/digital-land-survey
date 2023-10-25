const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')

// delete teacher
exports.deleteTeacher = async (req, res, next) => {
    try {
        const teacher_id = req.query.teacher_id;

        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', teacher: {} });
            }

            try {
                const get_teacher_query = 'SELECT * FROM teacher WHERE teacher_id = ?';
                const existing_teacher = await queryAsync(get_teacher_query, [teacher_id]);

                if (existing_teacher.length === 0) {
                    return res.status(200).json({ status: false, message: 'No teacher found', teacher: {} });
                }

                

                const delete_teacher_query = `DELETE FROM teacher WHERE teacher_id = ?`;
                
                await queryAsync(delete_teacher_query, [teacher_id]);

                
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to delete teacher', teacher: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', teacher: existing_teacher[0] });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', teacher: {} });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', teacher: {} });
    }
};
