const logger  = (req, res, next) => {
  
  const zaman = new Date().toISOString();
  console.log(`${zaman} - ${req.method} ${req.url}`);
  next();
}


