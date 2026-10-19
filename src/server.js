const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function initializeEnvironment() {
  const envPath = path.resolve(__dirname, '..', '.env');

  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, 'PORT=3000\n', 'utf8');
  }

  dotenv.config({ path: envPath });
}

initializeEnvironment();

const Port = process.env.PORT || 3000;
const app = require('./app');

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
}); 
