const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')

exports.getDivisionDistrictUpzila = async (req, res, next) => {
    try {
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', locations: [] });
            }

            try {
                const get_all_location_query = `SELECT
                                                d.*,
                                                di.district_id,
                                                di.district_name,
                                                di.district_createdAt,
                                                di.district_updatedAt,
                                                u.upzila_id,
                                                u.upzila_name,
                                                u.upzila_createdAt,
                                                u.upzila_updatedAt
                                            FROM
                                                divisions AS d
                                            LEFT JOIN
                                                districts AS di ON d.division_id = di.division_id
                                            LEFT JOIN
                                                upzilas AS u ON di.district_id = u.district_id`;
                const all_location = await queryAsyncWithoutValue(get_all_location_query);
                if (all_location.length === 0) {
                    return res.status(200).json({ status: true, message: 'No location found', locations: [] });
                }

                
            const nestedData = {
                divisions: [] // Initialize divisions as an empty list
            };
            
            all_location.forEach(location => {
                const divisionId = location.division_id;
                const districtId = location.district_id;
                const upzilaId = location.upzila_id;
            
                // Check if the division exists in the nested structure
                let division = nestedData.divisions.find(division => division.division_id === divisionId);
            
                if (!division) {
                division = {
                    division_id: divisionId,
                    division_name: location.division_name,
                    division_createdAt: location.division_createdAt,
                    division_updatedAt: location.division_updatedAt,
                    districts: [] // Initialize districts as an empty list
                };
                nestedData.divisions.push(division);
                }
            
                // Check if the district exists in the division
                let district = division.districts.find(district => district.district_id === districtId);
            
                if (!district && districtId!=null) {
                district = {
                    district_id: districtId,
                    district_name: location.district_name,
                    district_createdAt: location.district_createdAt,
                    district_updatedAt: location.district_updatedAt,
                    upzilas: [] // Initialize upzilas as an empty list
                };
                division.districts.push(district);
                }
            
                // Check if the upzila exists in the district
                if (upzilaId !== null) {
                district.upzilas.push({
                    upzila_id: upzilaId,
                    upzila_name: location.upzila_name,
                    upzila_createdAt: location.upzila_createdAt,
                    upzila_updatedAt: location.upzila_updatedAt
                });
                }
            });
  
  // Add this section to make district list empty for divisions without districts
            nestedData.divisions.forEach(division => {
                if (division.districts.length === 0) {
                    division.districts = [];
                }
            });
            
            
                                
               

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to find location', locations: [] });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', locations: nestedData.divisions });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', locations: [] });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', locations: [] });
    }
};
