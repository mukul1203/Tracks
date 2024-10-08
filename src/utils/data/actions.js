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

export const userSignIn = async (name, email, password) => {
  await auth.userSignIn(name, email, password);
  //Make the user entry in db here
  await createUser(name, auth.currentUserEmail(), auth.currentUserId());
};

export const userSignOut = async () => {
  const userId = auth.currentUserId();
  await auth.userSignOut();
  // Note: this only removes the user entry from db. This doesn't delete the user per se. That is done via deleteUser of firebase.
  await removeUser(userId);
};

const createUser = async (name, email, userId) => {
  console.log(`create user: ${name} ${email} ${userId}`);
  const user = makeUser(name, email, userId);
  console.log(user);
  await database.set(USERS + "/" + userId, user);
};

const removeUser = async (userId) => {
  await database.set(USERS + "/" + userId, null);
};
/***************** Invites *******************/

// Invite given emails to the given group
export async function invite(emails, toGroupId) {
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
    console.log(error.message);
  }
}

export const ignoreInvite = async (invite) => {
  //TODO
};

/***************** Groups *******************/

export const createGroup = async (emails, groupName) => {
  const { key: groupId } = database.push(GROUPS);
  await database.set(
    GROUPS + "/" + groupId,
    await makeGroup(groupId, emails, groupName, auth.currentUserId())
  );
  //Also invite the emails
  await invite(emails, groupId);
};

export const exitGroup = async (groupId) => {
  return database.set(
    USERS + "/" + auth.currentUserId() + USER_ACTIVE_GROUP,
    null
  );
};

export const joinGroup = (groupId) => {
  //set the user's groupId to this groupId
  //no need to await
  database.set(USERS + "/" + auth.currentUserId() + USER_ACTIVE_GROUP, groupId);
};

export const deleteGroup = async (groupId) => {
  //remove the invites to this group
  //remove the group from users if this is active group
  //remove the group from groups list
  const invites = await getInvitesToGroup(groupId);
  await database.update(
    INVITES,
    Object.keys(invites).reduce((acc, key) => {
      acc[key] = null;
      return acc;
    }, {})
  );
  const users = await getUsersWithActiveGroup(groupId);
  if (users) {
    Object.values(users).forEach((user) => {
      user[USER_ACTIVE_GROUP.substring(1)] = null;
    });
    await database.update(USERS, users);
  }
  await database.set(GROUPS + "/" + groupId, null);
};

/***************** Location *******************/

export const updateUser = async ({ latitude, longitude }) => {
  //send the data to DB
  await database.update(USERS + "/" + auth.currentUserId() + "/", {
    [USER_LATITUDE]: latitude,
    [USER_LONGITUDE]: longitude,
  });
};

export async function updateUserLocationInDB(latitude, longitude) {
  try {
    await updateUser({ latitude, longitude });
  } catch (error) {
    let errorMsg = "Update to db failed! " + error.message;
    return { errorMsg };
  }
  return {};
}
