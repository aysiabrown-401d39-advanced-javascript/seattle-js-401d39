'use strict';

// function that looks at the parameter and says, is this parametere in my capabilites? if it is, call next(). If it isn't, throw an error
// I know that there is a req.user because bearerAuth adds a uers key to the req object if it is successful

module.exports = (capability) => {
  return (req, res, next) => {
    try{
      if( req.user.capabilities.includes(capability) ){
        next();
      } else {
        next( 'Access Denied' );
      }
    } catch(e) {
      next( 'Invalid Login' );
    }
  }
}