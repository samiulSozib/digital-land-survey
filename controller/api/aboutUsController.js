const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')


// get all about_us 

exports.getAbout_us = async (req, res, next) => {
    try {
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', about_us: {} });
            }

            try {
                const get_all_about_uss_query = 'SELECT * FROM about_us';
                const all_about_us = await queryAsyncWithoutValue(get_all_about_uss_query);
                if (all_about_us.length === 0) {
                    return res.status(200).json({ status: true, message: 'No about us data found', about_us: {} });
                }

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to find about us data', about_us: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', about_us: all_about_us[0] });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', about_us: {} });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', about_us: {} });
    }
};
