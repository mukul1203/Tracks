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
  //observe a path for changes (like addition/deletion of children, modification of value )
  //set a value to path
  set: async function (path, value) {
    return await set(ref(firebaseDB, path), value);
  },
  get: async function (path, predicate = []) {
    //assuming data is object
    return await get(getConstrainedPathRef(path, predicate)).then((data) =>
      data.exportVal()
    );
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
