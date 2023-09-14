export const firebaseKeyCodec = {
	encode: function(s) { 
        return s.replace(/[/%\.#\$\[\]]/g, (c) => { 
            return '%' + c.charCodeAt(0).toString(16).toUpperCase(); 
        }); 
    },
	encodeFully: function(s) {
		return encodeURIComponent(s).replaceAll('.', '%2E');
	},
	decode: function(s) {
		return decodeURIComponent(s);
	}
};