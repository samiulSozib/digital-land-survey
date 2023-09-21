const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')


// get all services
exports.getOurServices = async (req, res, next) => {
    try {
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', our_services: [] });
            }

            try {
                const get_our_services_query = 'SELECT * FROM our_services';
                const our_services = await queryAsyncWithoutValue(get_our_services_query);
                if (our_services.length === 0) {
                    return res.status(200).json({ status: true, message: 'Our Services not found', our_services: [] });
                }
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to find Our Services', our_services: [] });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', our_services: our_services });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', our_services: [] });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', our_services: [] });
    }
};



