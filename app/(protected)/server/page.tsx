/*
* This is an example of a component that is only rendered on the server.
* It uses the "currentUser" function to get the current user.
 */

import React from 'react';
import {currentUser} from "@/lib/auth";
import UserInfo from "@/components/userInfo";

const ServerPage = async () => {
  const user = await currentUser();
  // console.log(user);
  return (
      <UserInfo user={user} label="🏬 Server component" />
  );
};

export default ServerPage;