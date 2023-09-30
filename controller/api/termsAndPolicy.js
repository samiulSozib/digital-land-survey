const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')



// get all terms_and_policy 

exports.getAllTerms_and_policy = async (req, res, next) => {
    try {
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', terms_policy: [] });
            }

            try {
                const get_all_terms_and_policys_query = 'SELECT * FROM terms_and_policy';
                const all_terms_and_policys = await queryAsyncWithoutValue(get_all_terms_and_policys_query);
                if (all_terms_and_policys.length === 0) {
                    return res.status(200).json({ status: true, message: 'No terms and policy found', terms_policy: [] });
                }
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to find terms and policy', terms_policy: [] });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', terms_policy: all_terms_and_policys });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', terms_policy: [] });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', terms_policy: [] });
    }
};


// delete terms_and_policy 
exports.deleteTerms_and_policy = async (req, res, next) => {
    try {
        const id = req.query.terms_and_policy_id; 

        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', terms_policy: {} });
            }

            try {
                const get_terms_and_policy_query = 'SELECT * FROM terms_and_policy WHERE id = ?';
                const existing_terms_and_policy = await queryAsync(get_terms_and_policy_query, [id]);

                if (existing_terms_and_policy.length === 0) {
                    return res.status(200).json({ status: false, message: 'No terms and policy found', terms_policy: {} });
                }

                const delete_terms_and_policy_query = 'DELETE FROM terms_and_policy WHERE id = ?';
                await queryAsync(delete_terms_and_policy_query, [id]);

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to delete terms and policy', terms_policy: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', terms_policy: existing_terms_and_policy[0] });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', terms_policy: {} });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', terms_policy: {} });
    }
};
