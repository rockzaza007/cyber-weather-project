const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.SECRET_KEY); // Should be a 32-byte key for aes-256
const iv = process.env.SECRET_KEY_IV;

module.exports = {

    async beforeCreate(event) {
        const Tel = event.params.data.Tel;
        const Email = event.params.data.email;
        const Serial = event.params.data.Serial;
        event.params.data.email = await encrypt(Email);
        event.params.data.Tel = await encrypt(Tel);
        event.params.data.Serial = await encrypt(Serial);
    },

    async beforeUpdate(event) {
        const Tel = event.params.data.Tel;
        const Email = event.params.data.email;
        const Serial = event.params.data.Serial;
        event.params.data.email = await encrypt(Email);
        event.params.data.Tel = await encrypt(Tel);
        event.params.data.Serial = await encrypt(Serial);
    },
    async afterFindOne(event) {
        console.log('afterFindOne', event.result);
        if (event.result && event.result.Tel) {
            if (event.result.Tel) {
                event.result.Tel = await decrypt(event.result.Tel);
            }
            if (event.result.email) {
                event.result.email = await decrypt(event.result.email);
            }
            if (event.result.Serial) {
                event.result.Serial = await decrypt(event.result.Serial);
            }
        }
    },
  async afterFindMany(event) {
            console.log('afterFindMany', event.result);
            event?.result?.map(async result => {
                if (result.Tel) {
                    result.Tel = await decrypt(result.Tel);
                }
                if (result.email) {
                    result.email = await decrypt(result.email);
                }
                if (result.Serial) {
                    result.Serial = await decrypt(result.Serial);
                }
            })
        },

    }

function encrypt(text) {
    let encryptedChunks = ''; // Array to store encrypted chunks
    let chunkSize = 4; // Size of each chunk
    for (let i = 0; i < text.length; i += chunkSize) {
        let chunk = text.slice(i, i + chunkSize); // Get a chunk of text
        const cipher = crypto.createCipheriv(algorithm, key, iv); // Create a cipher
        let encryptedChunk = cipher.update(chunk, 'utf8', 'hex'); // Encrypt the chunk
        encryptedChunk += cipher.final('hex');
        encryptedChunks += encryptedChunk;
        //encryptedChunks.push(encryptedChunk); // Push encrypted chunk to array
    }
    //encryptedChunks.push(cipher.final('hex')); // Finalize encryption and push last chunk
    return encryptedChunks; // Join encrypted chunks into a single string
}

function decrypt(text) {
    let decryptedChunks = ''; // String to store decrypted chunks
    let chunkSize = 32; // Size of each chunk in hex
    for (let i = 0; i < text.length; i += chunkSize) {
        const decipher = crypto.createDecipheriv(algorithm, key, iv); // Create a decipher
        let chunk = text.slice(i, i + chunkSize); // Get a chunk of text
        let decryptedChunk = decipher.update(chunk, 'hex', 'utf8'); // Decrypt the chunk
        decryptedChunks += decipher.final('utf8'); // Finalize decryption
        decryptedChunks += decryptedChunk; // Append decrypted chunk to string
    }
    // Handle padding issue by removing null characters
    decryptedChunks = decryptedChunks.replace(/\0/g, '');
    return decryptedChunks; // Return decrypted text
}
