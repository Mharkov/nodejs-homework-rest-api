const app = require('../app');
const db = require('../model/db');

const PORT = process.env.PORT || 3000;

db.then(() => {
  app.listen(PORT, () => {
    console.log(`Database connection successful. Use our API on port: ${PORT}`);
  });
}).catch((err) => {
  console.log(`Server no run. Error: ${err.message}`);
  process.exit(1);
});
