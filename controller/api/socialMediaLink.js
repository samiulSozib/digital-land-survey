const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')




// get all social_media_link 

exports.getAllsocial_media_link = async (req, res, next) => {
    try {
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', social_media: [] });
            }

            try {
                const get_all_social_media_links_query = 'SELECT * FROM social_media_link';
                const all_social_media_links = await queryAsyncWithoutValue(get_all_social_media_links_query);
                if (all_social_media_links.length === 0) {
                    return res.status(200).json({ status: true, message: 'No social media link found', social_media: [] });
                }
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to find social media link', social_media: [] });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', social_media: all_social_media_links });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', social_media: [] });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', social_media: [] });
    }
};


// delete social_media_link 
exports.deletesocial_media_link = async (req, res, next) => {
    try {
        const id = req.query.social_media_link_id; 

        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', social_media: {} });
            }

            try {
                const get_social_media_link_query = 'SELECT * FROM social_media_link WHERE id = ?';
                const existing_social_media_link = await queryAsync(get_social_media_link_query, [id]);

                if (existing_social_media_link.length === 0) {
                    return res.status(200).json({ status: false, message: 'No social media link found', social_media: {} });
                }

                const delete_social_media_link_query = 'DELETE FROM social_media_link WHERE id = ?';
                await queryAsync(delete_social_media_link_query, [id]);

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to delete social media link', social_media: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', social_media: existing_social_media_link[0] });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', social_media: {} });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', social_media: {} });
    }
};
