'use strict';
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.SECRET_KEY); // Should be a 32-byte key for aes-256
const iv = process.env.SECRET_KEY_IV; // Should be a 16-byte IV for aes-256-cbc
/**
 * weather-authorization service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::weather-authorization.weather-authorization', ({strapi}) => ({
    async encrypttel(tel) {
        let encryptedtel = '';
        // Split the phone number into pairs of two characters
        for (let i = 0; i < tel.length; i += 2) {
          const chunk = tel.slice(i, i + 2);
          // Encrypt each chunk and append to the result
          const cipher = crypto.createCipheriv(algorithm, key, iv);
          let encryptedChunk = cipher.update(chunk, 'utf8', 'hex');
          encryptedChunk += cipher.final('hex');
          encryptedtel += encryptedChunk;
        }
        return encryptedtel;
    },
    async decrypttel(encryptedtel) {
        let decryptedtel = '';
        // Split the encrypted phone number into pairs of encrypted chunks
        for (let i = 0; i < encryptedtel.length; i += 32) { // Assuming each chunk is 32 characters long
          const encryptedChunk = encryptedtel.slice(i, i + 32); // Assuming each chunk is 32 characters long
          // Decrypt each chunk and append to the result
          const decipher = crypto.createDecipheriv(algorithm, key, iv);
          let decryptedChunk = decipher.update(encryptedChunk, 'hex', 'utf8');
          decryptedChunk += decipher.final('utf8');
          decryptedtel += decryptedChunk;
        }
        return decryptedtel;
    }
}));