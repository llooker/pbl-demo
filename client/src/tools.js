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
    }
}