const bcrypt = require('bcrypt');

(async () => {
  const plainPassword = "";
  const hash = await bcrypt.hash(plainPassword, 10);
  console.log(hash);
})();
