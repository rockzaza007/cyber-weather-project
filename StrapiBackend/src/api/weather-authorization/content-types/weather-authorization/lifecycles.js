const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.SECRET_KEY); // Should be a 32-byte key for aes-256
const iv = process.env.SECRET_KEY_IV; // Should be a 16-byte IV for aes-256-cbc
const api = 'api::weather-authorization.weather-authorization';
const encrypt = async (data) => {return strapi.service(api).encrypttel(data)}
const decrypt = async (data) => {return strapi.service(api).decrypttel(data)}


module.exports = {
  async beforeCreate(event) {
    console.log('beforeCreate', event.params);
    const tel = event.params.data.tel;
    event.params.data.tel = await encrypt(tel);
  },
  async beforeUpdate(event) {
    console.log('beforeUpdate', event.params.data);
    const tel = event.params.data.tel;
    // Check if a phone number exists
    if (tel) {
      event.params.data.tel = await encrypt(tel);
    } 
  }, 
  async afterFindMany(event) {
    console.log('afterFindMany', event.result);
    event?.result?.map(async result => {
      if (result.tel) {
        result.tel = await decrypt(result.tel);
      }
    })
  },
  async afterFindOne(event) {
    console.log('afterFindOne', event.result);
    if (event.result && event.result.tel) {
      if (event.result.tel) {
        event.result.tel = await decrypt(event.result.tel);
      }
    }
  },
};
