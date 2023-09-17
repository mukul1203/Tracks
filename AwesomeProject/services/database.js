import { getDatabase, onValue, push, ref, set } from "firebase/database";

const firebaseDB = getDatabase();
export const database = {
  //observe a path for changes (like addition/deletion of children, modification of value )
  //set a value to path
  set: async function (path, value) {
    return await set(ref(firebaseDB, path), value);
  },
  push: function (path) {
    const { key } = push(ref(firebaseDB, path));
    return { key };
  },
  onValue: function (path, callback, errorCallback) {
    return onValue(
      ref(firebaseDB, path),
      (snapshot) => callback(snapshot.val()),
      errorCallback
    );
  },
};
