import { auth } from "../../services/auth";
import { database } from "../../services/database";
import { makeGroup, makeInvites, makeUser } from "./makers";
import {
  GROUPS,
  INVITE_ID,
  INVITES,
  USER_ACTIVE_GROUP,
  USER_LATITUDE,
  USER_LONGITUDE,
  USERS,
} from "./paths";
import { getInvitesToGroup, getUsersWithActiveGroup } from "./selectors";

/***************** Users *******************/

export const userSignIn = async (email: any, password: any) => {
  await auth.userSignIn(email, password);
};

export const userSignOut = async () => {
  const userId = auth.currentUserId();
  await auth.userSignOut();
  await deleteUserSessionData(userId);
};

export const userSignUp = async (name: any, email: any, password: any) => {
  // This will create a user account and also sign in the user on successful account creation
  await auth.userSignUp(email, password);
  //Make the user entry in db here
  await createUser(name, auth.currentUserEmail(), auth.currentUserId());
};

const createUser = async (name: any, email: any, userId: any) => {
  console.log(`create user: ${name} ${email} ${userId}`);
  const user = makeUser(name, email, userId);
  console.log(user);
  await database.set(USERS + "/" + userId, user);
};

const deleteUserSessionData = async (userId: any) => {
  const user = {
    [USER_LATITUDE.substring(1)]: null,
    [USER_LONGITUDE.substring(1)]: null,
    [USER_ACTIVE_GROUP.substring(1)]: null,
  };
  await database.update(USERS + "/" + userId, user);
};

/***************** Location *******************/

export async function updateUserLocation(latitude: any, longitude: any) {
  try {
    //send the data to DB
    await database.update(USERS + "/" + auth.currentUserId(), {
      [USER_LATITUDE.substring(1)]: latitude,
      [USER_LONGITUDE.substring(1)]: longitude,
    });
  } catch (error) {
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    let errorMsg = "Update to db failed! " + error.message;
    return { errorMsg };
  }
  return {};
}
/***************** Invites *******************/

// Invite given emails to the given group
export async function invite(emails: any, toGroupId: any) {
  try {
    const invites = await makeInvites(emails, toGroupId, auth.currentUserId());
    for (const invite of invites) {
      const { key: inviteId } = database.push(INVITES);
      database.set(INVITES + "/" + inviteId, {
        ...invite,
        [INVITE_ID.substring(1)]: inviteId,
      });
    }
  } catch (error) {
    //user with given email not found in users/
    //If we don't catch, none of the users get invites due to error thrown
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    console.log(error.message);
  }
}

export const ignoreInvite = async (invite: any) => {
  //TODO
};

/***************** Groups *******************/

export const createGroup = async (emails: any, groupName: any) => {
  const { key: groupId } = database.push(GROUPS);
  await database.set(
    GROUPS + "/" + groupId,
    await makeGroup(groupId, emails, groupName, auth.currentUserId())
  );
  //Also invite the emails
  await invite(emails, groupId);
};

export const exitGroup = async (groupId: any) => {
  return database.set(
    USERS + "/" + auth.currentUserId() + USER_ACTIVE_GROUP,
    null
  );
};

export const joinGroup = (groupId: any) => {
  //set the user's groupId to this groupId
  //no need to await
  database.set(USERS + "/" + auth.currentUserId() + USER_ACTIVE_GROUP, groupId);
};

export const deleteGroup = async (groupId: any) => {
  //remove the invites to this group
  //remove the group from users if this is active group
  //remove the group from groups list
  const invites = await getInvitesToGroup(groupId);
  await database.update(
    INVITES,
    Object.keys(invites).reduce((acc, key) => {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      acc[key] = null;
      return acc;
    }, {})
  );
  const users = await getUsersWithActiveGroup(groupId);
  if (users) {
    // @ts-expect-error TS(2550): Property 'values' does not exist on type 'ObjectCo... Remove this comment to see the full error message
    Object.values(users).forEach((user: any) => {
      user[USER_ACTIVE_GROUP.substring(1)] = null;
    });
    await database.update(USERS, users);
  }
  await database.set(GROUPS + "/" + groupId, null);
};
