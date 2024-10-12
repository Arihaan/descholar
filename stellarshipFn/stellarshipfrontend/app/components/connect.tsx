"use client";
import React from "react";
import { setAllowed } from "@stellar/freighter-api";

export interface ConnectButtonProps {
  label: string;
  isHigher?: boolean;
}

export function ConnectButton({ label }: ConnectButtonProps) {
  return (
    <button className={`btn btn-primary`} onClick={setAllowed}>
      {label}
    </button>
  );
}
