const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')
const base_url = require('../../const/const')

// get instrumentss list
exports.getInstruments=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
                const get_instruments_query=`SELECT * FROM instruments`;
                const instruments=await queryAsyncWithoutValue(get_instruments_query)
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(instruments)
                    return res.render('pages/instrument',{title:"Instruments",instruments,nav:"instruments"})
                })
            }catch(e){
                db.rollback();
                console.log(e)
                //req.flash('fail', 'Star Insert Fail')
                return res.redirect('/')
            }
        })
    }catch(e){
        console.log(e)
        //req.flash('fail', 'star Insert Fail')
        return res.redirect('/')
    }
}

// get add instrument
exports.getAddInstrument=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(customer[0])
                    return res.render('pages/addInstrument',{title:"Add Instrument",nav:"instruments"})
                })
            }catch(e){
                db.rollback();
                console.log(e)
                //req.flash('fail', 'Star Insert Fail')
                return res.redirect('/')
            }
        })
    }catch(e){
        console.log(e)
        //req.flash('fail', 'star Insert Fail')
        return res.redirect('/')
    }
}

// post add instrument
exports.postAddInstrument=async(req,res,next)=>{
    try{
        let {name,price,in_stock_quantity,description}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                let image=null

                if(req.file){
                    image=`${base_url}/uploads/${req.file.filename}`
                }

                const insert_instrument_query=`INSERT INTO instruments (name,image,description,price,in_stock_quantity) VALUES (?,?,?,?,?)`
                const values=[name,image,description,price,in_stock_quantity]
                await queryAsync(insert_instrument_query,values)
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(customer[0])
                    return res.redirect('/instruments')
                })
            }catch(e){
                db.rollback();
                console.log(e)
                //req.flash('fail', 'Star Insert Fail')
                return res.redirect('/')
            }
        })
    }catch(e){
        console.log(e)
        //req.flash('fail', 'star Insert Fail')
        return res.redirect('/')
    }
}

// get edit instrument
exports.getEditInstrument=async(req,res,next)=>{
    try{
        const instrument_id=req.params.instrument_id
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                const get_instrument_query=`SELECT * FROM instruments WHERE instrument_id=?`
                const instrument=await queryAsync(get_instrument_query,[instrument_id])
                
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(instrument)
                    return res.render('pages/editInstrument',{title:"Edit Instrument",instrument:instrument[0],nav:"instruments"})
                })
            }catch(e){
                db.rollback();
                console.log(e)
                //req.flash('fail', 'Star Insert Fail')
                return res.redirect('/')
            }
        })
    }catch(e){
        console.log(e)
        //req.flash('fail', 'star Insert Fail')
        return res.redirect('/')
    }
}

// post edit instrument
exports.postEditInstrument = async (req, res, next) => {
    try {
        const instrument_id=req.params.instrument_id
      const { id, name, price, in_stock_quantity, description } = req.body;
      db.beginTransaction(async (err) => {
        if (err) {
          return res.redirect('/');
        }
        try {
            const get_instrument_query=`SELECT * FROM instruments WHERE instrument_id=?`
            const instrument=await queryAsync(get_instrument_query,[instrument_id])
          let image = instrument[0].image;
  
          if (req.file) {
            image = `${base_url}/uploads/${req.file.filename}`;
          }
  
          const update_instrument_query = `
            UPDATE instruments
            SET name = ?, image = ?, description = ?, price = ?, in_stock_quantity = ?
            WHERE instrument_id = ?;
          `;
          const values = [name, image, description, price, in_stock_quantity, instrument_id];
          await queryAsync(update_instrument_query, values);
  
          db.commit((err) => {
            if (err) {
              db.rollback(() => {
                console.log(err)
                // Handle the update failure, e.g., show an error message and redirect
                return res.redirect('/');
              });
            }
            // Handle the update success, e.g., show a success message and redirect
            return res.redirect('/instruments');
          });
        } catch (e) {
          db.rollback();
          console.log(e);
          // Handle the update failure, e.g., show an error message and redirect
          return res.redirect('/');
        }
      });
    } catch (e) {
      console.log(e);
      // Handle the update failure, e.g., show an error message and redirect
      return res.redirect('/');
    }
  };
  

// get instrument order
exports.getInstrumentsOrder=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
                const get_instruments_order_query=`SELECT io.*,
                                            c.*,
                                            s.*,
                                            i.*,
                                            ot.*
                                            FROM instrument_order as io 
                                            LEFT JOIN customers as c ON c.customer_id=io.customer_id
                                            LEFT JOIN surveyors as s ON s.surveyor_id=io.surveyor_id
                                            INNER JOIN instruments as i ON i.instrument_id=io.instrument_id
                                            INNER JOIN order_transaction as ot ON ot.instrument_order_id=io.order_id
                                            `;


                const instruments_orders=await queryAsyncWithoutValue(get_instruments_order_query)
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(instruments_orders)
                    return res.render('pages/instrumentsOrder',{title:"Instruments Order",instruments_orders,nav:"instruments_order"})
                })
            }catch(e){
                db.rollback();
                console.log(e)
                //req.flash('fail', 'Star Insert Fail')
                return res.redirect('/')
            }
        })
    }catch(e){
        console.log(e)
        //req.flash('fail', 'star Insert Fail')
        return res.redirect('/')
    }
}

// get instrument order details
exports.getInstrumentsOrderDetails=async(req,res,next)=>{
    try{
        const instrument_order_id=req.params.instrument_order_id
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
                const get_instruments_order_query=`SELECT io.*,
                                            c.*,
                                            s.*,
                                            i.*,
                                            ot.*
                                            FROM instrument_order as io 
                                            LEFT JOIN customers as c ON c.customer_id=io.customer_id
                                            LEFT JOIN surveyors as s ON s.surveyor_id=io.surveyor_id
                                            INNER JOIN instruments as i ON i.instrument_id=io.instrument_id
                                            INNER JOIN order_transaction as ot ON ot.instrument_order_id=io.order_id
                                            WHERE io.order_id=?
                                            `;


                const instruments_orders=await queryAsync(get_instruments_order_query,[instrument_order_id])
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(instruments_orders[0])
                    return res.render('pages/instrumentsOrderDetails',{title:"Instruments Order Details",instruments_order:instruments_orders[0],nav:"instruments_order"})
                })
            }catch(e){
                db.rollback();
                console.log(e)
                //req.flash('fail', 'Star Insert Fail')
                return res.redirect('/')
            }
        })
    }catch(e){
        console.log(e)
        //req.flash('fail', 'star Insert Fail')
        return res.redirect('/')
    }
}

// get instrument transaction
exports.getInstrumentsOrderTransaction=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
                const get_instruments_order_transaction_query=`SELECT io.*,
                                            ot.*
                                            FROM instrument_order as io 
                                            INNER JOIN order_transaction as ot ON ot.instrument_order_id=io.order_id
                                            `;


                const instruments_orders_transactions=await queryAsyncWithoutValue(get_instruments_order_transaction_query)
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(instruments_orders_transactions)
                    return res.render('pages/instrumentsOrderTransaction',{title:"Instruments Order Transaction",instruments_orders_transactions,nav:"instruments_transaction"})
                })
            }catch(e){
                db.rollback();
                console.log(e)
                //req.flash('fail', 'Star Insert Fail')
                return res.redirect('/')
            }
        })
    }catch(e){
        console.log(e)
        //req.flash('fail', 'star Insert Fail')
        return res.redirect('/')
    }
}

