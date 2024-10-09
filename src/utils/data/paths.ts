/**
* Schema of groups in database
* 
 {
  "groups": {
    "group_id_1": {
      "name": "Group 1",
      "createdBy": "uid_1",
      "members": {
        "uid_1": true,
        "uid_2": false
      },
      "id": "group_id_1"
    },
    "group_id_2": {
      "name": "Group 2",
      "createdBy": "uid_2",
      "members": {
        "uid_2": true
      },
      "id": "group_id_2"
    }
  }
}

* Schema of users in database
*

{
  "users": {
    "uid_1": {
      "email": "user1@example.com",
      "latitude": 22.45,
      "longitude": 35.454,
      "groupId": "group_id_1",
      "name": "Jack",
      "id": "uid_1"
    },
    "uid_2": {
      "email": "user2@example.com",
      "latitude": 223.45,
      "longitude": 335.454,
      "groupId": "group_id_2",
      "name": "Jill",
      "id": "uid_2"
    }
  }
}

*
* Schema of invites in database
{
  "invites": {
    "invite_id_1": {
      "group_id": "group_id_1",
      "sent_to": "uid_2",
      "sent_by": "uid_1",
      "status": "pending",
      "id": "invite_id_2"
    },
    "invite_id_2": {
      "group_id": "group_id_1",
      "sent_to": "uid_3",
      "sent_by": "uid_1",
      "status": "accepted",
      "id": "invite_id_2"
    }
  }
}
* 
*/

// level 1
export const USERS = "/users";
export const GROUPS = "/groups";
export const INVITES = "/invites";

// level 2
// Group
export const GROUP_NAME = "/name";
export const GROUP_CREATED_BY = "/createdBy";
export const GROUP_MEMBERS = "/members";
export const GROUP_ID = "/id";
// User
export const USER_EMAIL = "/email";
export const USER_LATITUDE = "/latitude";
export const USER_LONGITUDE = "/longitude";
export const USER_ACTIVE_GROUP = "/groupId";
export const USER_ID = "/id";
export const USER_NAME = "/name";
// Invite
export const INVITE_GROUP = "/groupId";
export const INVITE_SENT_TO = "/sentTo";
export const INVITE_SENT_BY = "/sentBy";
export const INVITE_ID = "/id";
