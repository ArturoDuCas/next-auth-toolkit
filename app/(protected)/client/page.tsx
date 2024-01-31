"use client";

/*
* This component is an example of a component that is only rendered on the client.
* It uses the "useCurrentUser" hook to get the current user.
*/

import React from 'react';
import UserInfo from "@/components/userInfo";
import {useCurrentUser} from "@/hooks/useCurrentUser";

const ClientComponent = () => {
  const user = useCurrentUser();

  return (
      <UserInfo user={user} label="🧑🏽 Client component" />
  );
};

export default ClientComponent;