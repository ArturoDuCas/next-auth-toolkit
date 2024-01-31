'use client';

import {UserRole} from "@prisma/client";

interface RoleGateProps {
  children: React.ReactNode,
  allowedRole: UserRole,
}

import React from 'react';
import {useCurrentRole} from "@/hooks/useCurrentRole";
import FormError from "@/components/formError";

const RoleGate = ({children, allowedRole}: RoleGateProps) => {
  const role = useCurrentRole();

  if(role != allowedRole) {
    return(
        <FormError message="You don't have permission to view this content!"/>
    );
  }

  return (
      <>
        {children}
      </>
  );
};

export default RoleGate;