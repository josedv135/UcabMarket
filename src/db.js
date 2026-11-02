// Unico modulo que lee y escribe los archivos JSON de db/.
const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, '..', 'db');

function leer(coleccion) {
  return JSON.parse(fs.readFileSync(path.join(DB_DIR, `${coleccion}.json`), 'utf8'));
}

function guardar(coleccion, datos) {
  fs.writeFileSync(path.join(DB_DIR, `${coleccion}.json`), JSON.stringify(datos, null, 2));
}

module.exports = { leer, guardar };
