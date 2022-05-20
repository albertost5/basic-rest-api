const Category = require('../src/api/models/category');
const { customErrorResponse } = require('../src/utils/error.util');


const checkCategoryExists = async( req, res, next ) => {

    const { id } = req.params;
    
    try {  
        const category = await Category.findById( id ).populate( 'user', ['id', 'name'] );
        
        if( !category ) {
            return res.status(404).json( customErrorResponse("40401", "NOT_FOUND", "There was an error finding the category") );
        } else if ( !category.status ) {
            return res.status(404).json( customErrorResponse("40401", "NOT_FOUND", "The category is inactive") );
        }

        req.category = category;
        next();

    } catch (error) {
        return res.status(404).json( customErrorResponse("40400", "NOT_FOUND", "There was an error finding the category") )
    }
}

module.exports = {
    checkCategoryExists
}