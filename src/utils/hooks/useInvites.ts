import { useEffect, useState } from "react";
import { database } from "../../services/database";
import { auth } from "../../services/auth";
import {
  INVITE_ID,
  INVITE_SENT_BY,
  INVITE_SENT_TO,
  INVITES,
} from "../data/paths";
import { getCurrentUserId, getValueFromPath } from "../data/selectors";

// function useSentInvites(init, setErrorMsg) {
//   const [invites, setInvites] = useState(init);
//   useEffect(() => {
//     const unsubscribeAdd = database.onChildAdded(
//       INVITES,
//       [INVITE_SENT_BY.substring(1), "equals", auth.currentUserId()],
//       ({ key, val }) => {
//         setInvites((invites) => [...invites, val]);
//       },
//       (error) => setErrorMsg(error.message)
//     );
//     const unsubscribeRemove = database.onChildRemoved(
//       INVITES,
//       [INVITE_SENT_BY.substring(1), "equals", auth.currentUserId()],
//       ({ key, val }) => {
//         setInvites((invites) =>
//           invites.filter((elem) => elem.sent_to != val.sent_to)
//         );
//       },
//       (error) => setErrorMsg(error.message)
//     );
//     return () => {
//       unsubscribeAdd();
//       unsubscribeRemove();
//     };
//   }, []);
//   return invites;
// }

function useReceivedInvites(setErrorMsg) {
  const [invites, setInvites] = useState([]);
  useEffect(() => {
    const unsubscribeAdd = database.onChildAdded(
      INVITES,
      [INVITE_SENT_TO.substring(1), "equals", auth.currentUserId()],
      ({ key, val }) => {
        setInvites((invites) => [...invites, val]);
      },
      (error) => setErrorMsg(error.message)
    );
    const unsubscribeRemove = database.onChildRemoved(
      INVITES,
      [INVITE_SENT_TO.substring(1), "equals", auth.currentUserId()],
      ({ key, val }) => {
        setInvites((invites) =>
          invites.filter((elem) => getValueFromPath(elem, INVITE_ID) != key)
        );
      },
      (error) => setErrorMsg(error.message)
    );
    return () => {
      unsubscribeAdd();
      unsubscribeRemove();
    };
  }, []);
  return [invites];
}

export const useInvites = (setErrorMsg) => {
  const [invites] = useReceivedInvites(setErrorMsg);
  return {
    receivedInvites: invites,
  };
};
