import CryptoJS from "crypto-js";

// export const encryptDes = (message, key) => {
//   let keyHex = CryptoJS.enc.Utf8.parse(key);
//   let encrypted = CryptoJS.DES.encrypt(message, keyHex, {
//     mode: CryptoJS.mode.ECB,
//     padding: CryptoJS.pad.Pkcs7
//   });
//   return encrypted.toString();
// }

// des加密（有密文）
export const encryptDes = (message, key) => {
  let keyHex = CryptoJS.enc.Utf8.parse(key);
  let encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString();
};

// 解密
export const decryptDes = (ciphertext, key) => {
  let keyHex = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.DES.decrypt(ciphertext, keyHex, {
    iv: keyHex,
    mode: CryptoJS.mode.CBC, // 可省略
    padding: CryptoJS.pad.Pkcs7, // 可省略
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const subStringForExceptLetter = (str) => {
  let strArray = [];
  let s = "";
  let p = /[a-z]/i;
  for (let i = 0; i < str.length; i++) {
    let c = str.charAt(i);
    if (p.test(c)) {
      let a = s.toString();
      strArray.push(a);
      s = "";
    } else {
      s = s + c;
    }
  }
  if (s.length > 8) {
    s = s.substring(s.length - 8, s.length);
  }
  return s;
};
