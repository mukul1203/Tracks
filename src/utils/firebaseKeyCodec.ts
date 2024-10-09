export const firebaseKeyCodec = {
  encode: function (s: any) {
    return s.replace(/[/%\.#\$\[\]]/g, (c: any) => {
      return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
  },
  encodeFully: function (s: any) {
    // @ts-expect-error TS(2550): Property 'replaceAll' does not exist on type 'stri... Remove this comment to see the full error message
    return encodeURIComponent(s).replaceAll(".", "%2E");
  },
  decode: function (s: any) {
    return decodeURIComponent(s);
  },
};
