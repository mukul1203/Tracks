import {
  GROUP_CREATED_BY,
  GROUP_ID,
  GROUP_MEMBERS,
  GROUP_NAME,
  INVITE_GROUP,
  INVITE_ID,
  INVITE_SENT_BY,
  INVITE_SENT_TO,
  USER_EMAIL,
  USER_ID,
  USER_NAME,
} from "./paths";
import { getUserIds } from "./selectors";

export const makeObjFromlist = (list) => {
  console.log(list);
  return list.reduce((acc, item) => {
    acc[item] = true;
    return acc;
  }, {});
};

export const makeInvites = async (emails, toGroupId, from) => {
  return (await getUserIds(emails)).map((userId) => {
    return {
      [INVITE_SENT_BY.substring(1)]: from,
      [INVITE_SENT_TO.substring(1)]: userId,
      [INVITE_GROUP.substring(1)]: toGroupId,
    };
  });
};
export const makeGroup = async (id, emails, groupName, createdBy) => {
  return {
    [GROUP_NAME.substring(1)]: groupName,
    [GROUP_CREATED_BY.substring(1)]: createdBy,
    [GROUP_MEMBERS.substring(1)]: makeObjFromlist(await getUserIds(emails)),
    [GROUP_ID.substring(1)]: id,
  };
};
export const makeUser = (name, email, userId) => {
  return {
    [USER_EMAIL.substring(1)]: email,
    [USER_ID.substring(1)]: userId,
    [USER_NAME.substring(1)]: name,
  };
};
