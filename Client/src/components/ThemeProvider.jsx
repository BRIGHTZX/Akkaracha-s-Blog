import { createContext, useContext, useEffect, useState } from "react";

import React from "react";

function ThemeProvider() {
  const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
  };
  return <div>ThemeProvider</div>;
}

export default ThemeProvider;
