const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')


// get all banner 

exports.getBanner = async (req, res, next) => {
    try {
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', banner: [] });
            }

            try {
                const get_all_banners_query = 'SELECT * FROM banner';
                const all_banner = await queryAsyncWithoutValue(get_all_banners_query);
                if (all_banner.length === 0) {
                    return res.status(200).json({ status: true, message: 'No banner data found', banner: [] });
                }

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to find banner data', banner: [] });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', banner: all_banner });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', banner: [] });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', banner: [] });
    }
};