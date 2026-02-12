"use client";

import { useState, useCallback } from "react";
import DreamForm from "./DreamForm";
import SpreadsheetSettings from "./SpreadsheetSettings";

export default function DreamManager() {
  const [userSpreadsheetId, setUserSpreadsheetId] = useState<string | null>(null);

  const handleSpreadsheetIdChange = useCallback((id: string | null) => {
    setUserSpreadsheetId(id);
  }, []);

  return (
    <>
      <SpreadsheetSettings onSpreadsheetIdChange={handleSpreadsheetIdChange} />
      <DreamForm spreadsheetId={userSpreadsheetId} />
    </>
  );
}
