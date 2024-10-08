import {
  equalTo,
  get,
  getDatabase,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  set,
  update,
} from "firebase/database";

const firebaseDB = getDatabase();
function getConstraint(string) {
  switch (string) {
    case "equals":
      return equalTo;
  }
  return (val) =>
    console.log("Unsupported operator is predicate for db node observer");
}

function getConstrainedPathRef(path, predicate) {
  let pathRef = ref(firebaseDB, path);
  if (predicate.length > 0) {
    const [attribute, operator, value] = predicate;
    pathRef = query(
      pathRef,
      orderByChild(attribute),
      getConstraint(operator)(value)
    );
  }
  return pathRef;
}

export const database = {
  //set a value to path
  set: async function (path, value) {
    return await set(ref(firebaseDB, path), value);
  },
  //get data at the given path, but consisting only of the children satisfying given predicate
  get: async function (path, predicate = []) {
    //assuming data is object
    return await get(getConstrainedPathRef(path, predicate)).then((data) =>
      data.exportVal()
    );
  },
  //update data at given path with given update object
  update: async function (path, updateObj) {
    return await update(ref(firebaseDB, path), updateObj);
  },
  //create a unique child entry in the given path. Firebase will generate a unique key and this method returns that key.
  push: function (path) {
    const { key } = push(ref(firebaseDB, path));
    return { key };
  },
  //listen for data changes at given path. Callback receives the data at the path in case of any changes.
  onValue: function (path, callback, errorCallback) {
    return onValue(
      ref(firebaseDB, path),
      (snapshot) => callback(snapshot.val()),
      errorCallback
    );
  },

  //observable collection - observe for addition/deletion/update of a child in the collection

  //predicate is an array of [attribute, operator, value], telling that listen to children at
  //given path, ONLY those that fullfil the predicate i.e. whose given attribute (string) is 'operator' (e.g. "equals")
  //value.
  onChildAdded: function (path, predicate, addedCallback, errorCallback) {
    const pathRef = getConstrainedPathRef(path, predicate);
    const unsubscribeAdd = onChildAdded(
      pathRef,
      (data) => {
        //assuming the value is an object
        addedCallback({ key: data.key, val: data.exportVal() });
      },
      errorCallback
    );
    return unsubscribeAdd;
  },
  onChildRemoved: function (path, predicate, removedCallback, errorCallback) {
    const pathRef = getConstrainedPathRef(path, predicate);
    const unsubscribeRemove = onChildRemoved(
      pathRef,
      (data) => {
        removedCallback({ key: data.key, val: data.exportVal() });
      },
      errorCallback
    );
    return unsubscribeRemove;
  },
  onChildChanged: function (path, predicate, changedCallback, errorCallback) {
    const pathRef = getConstrainedPathRef(path, predicate);
    const unsubscribeChange = onChildChanged(
      pathRef,
      (data) => {
        changedCallback({ key: data.key, val: data.exportVal() });
      },
      errorCallback
    );
    return unsubscribeChange;
  },
};
