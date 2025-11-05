// utils/barcodeGenerator.js
const crypto = require('crypto');

function generarCodigoDeBarras() {
  const codigo = crypto.randomBytes(4).toString('hex').toUpperCase(); // ejemplo: 'A3F91B2C'
  const hash = crypto.createHash('sha256').update(codigo).digest('hex');
  return { codigo, hash };
}

module.exports = { generarCodigoDeBarras };
