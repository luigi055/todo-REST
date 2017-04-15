const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
// JSON WEB TOKEN implemented with a library
// jwt.sign
// jwt.verify

var data = {
  id: 5,
};

// generate a token
// the jwt always return a different hash value
// 123abc is the signature (secret extension of our token)
const token = jwt.sign(data, '123abc');
console.log(token);

// verify our token and decode
// if the signature is not the same as used with token. this will returns an error
const decoded = jwt.verify(token, '123abc');
console.log(decoded);

// JSON WEB TOKEN THEORY

// const message = 'i am user number 3';
// // this converts message to object so we have to convert it to string again
// var hash = SHA256(message).toString();

// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);

// var data = {
//   id: 4,
// };

// var token = {
//   data,
//   // transform our data to json since we need to use string with sha256 and since this transforms it 
//   // again to an bject we have to use toString()
//   // Salting is hashing a value but add something extra to protect
//   // we're using "somesecret" to extend and salt our tocken
//   hash: SHA256(JSON.stringify(data) + "somesecret").toString(),
// }

// // changing the data (don't trust)
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// // salting
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//   console.log('data was not changed');
// } else {
//   console.log('data was changed. Don\'t trust!');
// }

