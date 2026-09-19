const Port = process.env.PORT || 3000;
const app = require('./app');

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
}); 
