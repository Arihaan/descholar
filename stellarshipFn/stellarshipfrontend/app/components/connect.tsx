"use client";
import React, { useState } from "react";

import { kit, setPublicKey } from "../stellar-wallets-kit";

export interface ConnectButtonProps {
  label: string;
  isHigher?: boolean;
}

export function ConnectButton({ label }: ConnectButtonProps) {
  const [publicKey, setPublicKeyState] = useState("");

  const handleClick = async () => {
    try {
      await kit.openModal({
        onWalletSelected: async (option) => {
          try {
            kit.setWallet(option.id);
            const { address } = await kit.getAddress();
            setPublicKey(address);
            setPublicKeyState(address);
            console.log(address);
          } catch (e) {
            console.error(e);
          }
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <button className={`btn btn-primary`} onClick={handleClick}>
        {publicKey ? publicKey.substring(0, 6) + "..." : label}
      </button>
    </>
  );
}
