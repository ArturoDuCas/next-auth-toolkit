"use client";

import React from 'react';
import {logout} from "@/actions/logout";

const SettingsPage = () => {

  const onClick = async () => {
    await logout();
  }

  return (
      <div className="bg-white p-10 rounded-xl">
        <button onClick={onClick} type="submit">Sing out</button>
      </div>
  );
};

export default SettingsPage;