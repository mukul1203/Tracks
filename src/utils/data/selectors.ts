import { database } from "../../services/database";
import { assert } from "../assert";
import { memoize } from "../memoize";
import {
  GROUP_MEMBERS,
  GROUPS,
  INVITE_GROUP,
  INVITES,
  USER_ACTIVE_GROUP,
  USER_EMAIL,
  USER_ID,
  USERS,
} from "./paths";

// We may memoize the selectors to minimize database calls.
// We could improve the memoization efficiency by using immutable datastructures.

export const getUserIds = async (emails: any) => {
  //firebase realtime db doesn't support an 'in' operator like firestore.
  //so we are left with firing multiple queries to get this done.
  //why not switch to firestore?
  return (
    await Promise.all(
      emails.map(async (email: any) => getValueFromPath(await getUserFromEmail(email), USER_ID)
      )
    )
  ).filter((e) => e); // take only non nullish entrie
};

export const getGroup = async (groupId: any) => {
  return await database.get(GROUPS + "/" + groupId);
};

export const getUser = async (userId: any) => {
  return await database.get(USERS + "/" + userId);
};

export const getUserFromEmail = async (email: any) => {
  const users = await database.get(USERS, [
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
    USER_EMAIL.substring(1),
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
    "equals",
    // @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
    email,
  ]);
  if (users) {
    const keys = Object.keys(users); //There should be only one userId with given email
    assert(keys.length == 1, "There should be only one user for a given email");
    return users[keys[0]];
  }
  return null;
};

export const getValueFromPath = (obj: any, path: any) => {
  // Split the path into an array of keys, removing any leading slashes
  const keys = path.replace(/^\//, "").split("/");

  // Use reduce to traverse the object using the keys
  return keys.reduce((acc: any, key: any) => acc && acc[key], obj);
};

// given user ids, get all the users
export const getUsersFromIds = async (userIds: any) => {
  return await Promise.all(
    userIds.map(async (userId: any) => await getUser(userId))
  );
};

// given groupIds, get all the groups
export const getGroupsFromIds = async (groupIds: any) => {
  return await Promise.all(
    groupIds.map(async (groupId: any) => await getGroup(groupId))
  );
};

// Note: returns an object like { invite_id_1: {}, invite_id_2:{} }
export const getInvitesToGroup = async (groupId: any) => {
  return await database.get(INVITES, [
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
    INVITE_GROUP.substring(1),
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
    "equals",
    // @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
    groupId,
  ]);
};

// given a groupId, get all the users who are active in that group
// this may be different from getting the group corresponding to group id and then returning its members
// TODO: should we just keep this info only in one place rather than two, and also if kept in both places,
// we should make sure they are consistent.
export const getUsersWithActiveGroup = async (groupId: any) => {
  return await database.get(USERS, [
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
    USER_ACTIVE_GROUP.substring(1),
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
    "equals",
    // @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
    groupId,
  ]);
};

// given a group, get its members (users)
export const getGroupMembers = async (group: any) => {
  return await getUsersFromIds(
    Object.keys(getValueFromPath(group, GROUP_MEMBERS))
  );
};
