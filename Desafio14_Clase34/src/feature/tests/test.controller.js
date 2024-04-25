async function loggerTest(req, res) {
   
        req.logger.fatal("fatal!!")
        req.logger.error("error!!")
        req.logger.warning("warning!!")
        req.logger.info("info!!")
        req.logger.debug("debug!!")
        return res.send({status:"success",message:"Prueba del logger"});
    
}

export default {loggerTest}