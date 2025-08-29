const bcrypt = require('bcrypt');
const password = 'monMotDePasse123';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
