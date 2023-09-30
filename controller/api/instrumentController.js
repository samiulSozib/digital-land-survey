const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')

// get all instuments
exports.getAllInstruments = async (req, res, next) => {
    try {
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', instruments: [] });
            }

            try {
                const get_all_instruments_query = 'SELECT * FROM instruments';
                const all_instruments = await queryAsyncWithoutValue(get_all_instruments_query);
                if (all_instruments.length === 0) {
                    return res.status(200).json({ status: true, message: 'No instruments found', instruments: [] });
                }
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to find instruments', instruments: [] });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', instruments: all_instruments });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', instruments: [] });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', instruments: [] });
    }
};

// get instument by id
exports.getInstrumentById = async (req, res, next) => {
    try {
        const instrument_id=req.query.instrument_id
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', instrument: {} });
            }

            try {
                const get_instrument_query = 'SELECT * FROM instruments WHERE instrument_id=?';
                const instrument = await queryAsync(get_instrument_query,[instrument_id]);
                if (instrument.length === 0) {
                    return res.status(200).json({ status: true, message: 'No instrument found', instrument: {} });
                }
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to find instrument', instrument: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', instrument: instrument[0] });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', instrument: {} });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', instrument: {} });
    }
};

// delete instrument
exports.deleteInstrument = async (req, res, next) => {
    try {
        const instrument_id = req.query.instrument_id;

        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', instrument: {} });
            }

            try {
                const get_instrument_query = 'SELECT * FROM instruments WHERE instrument_id = ?';
                const existing_instrument = await queryAsync(get_instrument_query, [instrument_id]);

                if (existing_instrument.length === 0) {
                    return res.status(200).json({ status: false, message: 'No instrument found', instrument: {} });
                }

                

                const delete_instrument_query = `DELETE FROM instruments WHERE instrument_id = ?`;
                
                await queryAsync(delete_instrument_query, [instrument_id]);

                
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to delete instrument', instrument: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', instrument: existing_instrument[0] });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', instrument: {} });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', instrument: {} });
    }
};
