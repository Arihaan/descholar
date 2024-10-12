"use client";
import React, { useEffect, useState } from "react";

import { kit, setPublicKey } from "../stellar-wallets-kit";

export interface ConnectButtonProps {
  label: string;
  isHigher?: boolean;
}

export function ConnectButton({ label }: ConnectButtonProps) {
  const [publicKey, setPublicKeyState] = useState("");

  // Call checkAddress on component mount using useEffect
  useEffect(() => {
    const checkAddressAndSetState = async () => {
      try {
        const { address } = await kit.getAddress();
        setPublicKey(address);
        setPublicKeyState(address);
      } catch (e) {
        console.error(e);
      }
    };
    checkAddressAndSetState();
  }, []);

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
