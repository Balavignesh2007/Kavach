const crypto = require('crypto');

// Use a 32-byte key derived from JWT_SECRET for AES-256
const ENCRYPTION_KEY = crypto.createHash('sha256').update(process.env.JWT_SECRET || 'fallback_secret_key_123').digest('base64').substring(0, 32);
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  if (!text) return null;
  const textParts = text.split(':');
  if (textParts.length !== 2) return null;
  
  try {
    const iv = Buffer.from(textParts[0], 'hex');
    const encryptedText = Buffer.from(textParts[1], 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    console.error('Decryption failed:', err.message);
    return null;
  }
}

// Compare two face embeddings (arrays of numbers)
function getDistance(emb1, emb2) {
  if (!emb1 || !emb2 || emb1.length !== emb2.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < emb1.length; i++) {
    sum += Math.pow(emb1[i] - emb2[i], 2);
  }
  return Math.sqrt(sum);
}

// Compare live face to 3 stored faces
function compareMultipleEmbeddings(storedEmbeddings, liveEmbedding, threshold = 0.45) {
  if (!storedEmbeddings || storedEmbeddings.length === 0) return false;
  
  let bestDistance = Infinity;
  for (const stored of storedEmbeddings) {
    const dist = getDistance(stored, liveEmbedding);
    if (dist < bestDistance) {
      bestDistance = dist;
    }
  }
  console.log(`Best face match distance across samples: ${bestDistance}`);
  return bestDistance < threshold;
}

module.exports = {
  encrypt,
  decrypt,
  compareMultipleEmbeddings
};
