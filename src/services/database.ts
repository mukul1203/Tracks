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
function getConstraint(string: any) {
  switch (string) {
    case "equals":
      return equalTo;
  }
  return (val: any) => console.log("Unsupported operator is predicate for db node observer");
}

function getConstrainedPathRef(path: any, predicate: any) {
  let pathRef = ref(firebaseDB, path);
  if (predicate.length > 0) {
    const [attribute, operator, value] = predicate;
    // @ts-expect-error TS(2739): Type 'Query' is missing the following properties f... Remove this comment to see the full error message
    pathRef = query(
      pathRef,
      orderByChild(attribute),
      // @ts-expect-error TS(2345): Argument of type 'void | QueryConstraint' is not a... Remove this comment to see the full error message
      getConstraint(operator)(value)
    );
  }
  return pathRef;
}

export const database = {
  //set a value to path
  set: async function (path: any, value: any) {
    return await set(ref(firebaseDB, path), value);
  },
  //get data at the given path, but consisting only of the children satisfying given predicate
  get: async function (path: any, predicate = []) {
    //assuming data is object
    return await get(getConstrainedPathRef(path, predicate)).then((data) =>
      data.exportVal()
    );
  },
  //update data at given path with given update object
  update: async function (path: any, updateObj: any) {
    return await update(ref(firebaseDB, path), updateObj);
  },
  //create a unique child entry in the given path. Firebase will generate a unique key and this method returns that key.
  push: function (path: any) {
    const { key } = push(ref(firebaseDB, path));
    return { key };
  },
  //listen for data changes at given path. Callback receives the data at the path in case of any changes.
  onValue: function (path: any, callback: any, errorCallback: any) {
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
  onChildAdded: function (path: any, predicate: any, addedCallback: any, errorCallback: any) {
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
  onChildRemoved: function (path: any, predicate: any, removedCallback: any, errorCallback: any) {
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
  onChildChanged: function (path: any, predicate: any, changedCallback: any, errorCallback: any) {
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
