import { useEffect, useState } from "react";
import { database } from "../../services/database";
import { auth } from "../../services/auth";
import {
  INVITE_ID,
  INVITE_SENT_BY,
  INVITE_SENT_TO,
  INVITES,
} from "../data/paths";
// @ts-expect-error TS(2305): Module '"../data/selectors"' has no exported membe... Remove this comment to see the full error message
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

function useReceivedInvites(setErrorMsg: any) {
  const [invites, setInvites] = useState([]);
  useEffect(() => {
    const unsubscribeAdd = database.onChildAdded(
      INVITES,
      [INVITE_SENT_TO.substring(1), "equals", auth.currentUserId()],
      ({
        key,
        val
      }: any) => {
        // @ts-expect-error TS(2345): Argument of type '(invites: never[]) => any[]' is ... Remove this comment to see the full error message
        setInvites((invites) => [...invites, val]);
      },
      (error: any) => setErrorMsg(error.message)
    );
    const unsubscribeRemove = database.onChildRemoved(
      INVITES,
      [INVITE_SENT_TO.substring(1), "equals", auth.currentUserId()],
      ({
        key,
        val
      }: any) => {
        setInvites((invites) =>
          invites.filter((elem) => getValueFromPath(elem, INVITE_ID) != key)
        );
      },
      (error: any) => setErrorMsg(error.message)
    );
    return () => {
      unsubscribeAdd();
      unsubscribeRemove();
    };
  }, []);
  return [invites];
}

export const useInvites = (setErrorMsg: any) => {
  const [invites] = useReceivedInvites(setErrorMsg);
  return {
    receivedInvites: invites,
  };
};
