module.exports = {
  makeid: (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },


  validIdHelper: (str) => {
    // console.log('validIdHelper')
    // console.log('str', str)
    //need to replace special characters that may be associated with id...
    return str.replace(/[^a-zA-Z0-9-.#]/g, "")
  },

  prettifyString: (str) => {
    var i, frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  },

  getUrlVars: (url) => {
    var hash;
    var myJson = {};
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      myJson[hash[0]] = hash[1];
      // If you want to get in native datatypes
      // myJson[hash[0]] = JSON.parse(hash[1]); 
    }
    return myJson;
  },


  decodeHtml: (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
}