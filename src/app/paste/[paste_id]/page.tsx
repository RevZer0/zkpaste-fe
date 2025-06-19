"use client";

import { use, useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { DecryptPaste, ProofOfKnowlege } from "@/app/service/paste";
import { DearmorValue, ArmorValue } from "@/app/service/armor";

import { DeleteModal } from "@/components/DeleteModal";

import { getPasteHandler } from "@/handlers/paste/get";
import { updateViewCountHandler } from "@/handlers/paste/udpate_view";
import { PasteNotFound } from "@/components/view_paste/PasteNotFound";
import { EnterPasswordDialog } from "@/components/view_paste/EnterPasswordDialog";
import {
  PasteDecryptionState,
  PasteLoadState,
  usePasteViewStore,
} from "@/stores/paste";

const PasteView = ({ params }: { params: Promise<{ paste_id: string }> }) => {
  const { paste_id } = use(params);

  const password = usePasteViewStore((state) => state.password);
  const encryptionKey = usePasteViewStore((state) => state.encryptionKey);
  const pasteData = usePasteViewStore((state) => state.pasteData);
  const plainText = usePasteViewStore((state) => state.plainText);

  const loadState = usePasteViewStore((state) => state.loadState);
  const loadSuccess = usePasteViewStore((state) => state.loadSuccess);
  const loadFailed = usePasteViewStore((state) => state.loadFailed);

  const decryptState = usePasteViewStore((state) => state.decryptState);
  const decryptSuccess = usePasteViewStore((state) => state.decryptionSuccess);
  const decryptFailed = usePasteViewStore((state) => state.decryptionFailed);
  const decryptPasswordRequired = usePasteViewStore(
    (state) => state.decryptionPasswordRequired,
  );

  const toggleDelete = usePasteViewStore((state) => state.toggleDelete);

  const updateViewCount = async () => {
    if (!encryptionKey || !plainText) {
      return;
    }
    const signature = await ProofOfKnowlege(encryptionKey, plainText, password);
    try {
      await updateViewCountHandler({
        paste_id: paste_id,
        signature: ArmorValue(signature),
      });
    } catch (e) {}
  };

  const fetchPasteData = async () => {
    try {
      const data = await getPasteHandler({ paste_id: paste_id });
      loadSuccess({
        pasteId: paste_id,
        iv: data.iv,
        paste: data.paste,
        passwordProtected: data.password_protected,
      });
      if (data.password_protected) {
        decryptPasswordRequired();
      }
    } catch (e) {
      loadFailed();
    }
  };

  const decodeCipher = async () => {
    const keyString = window.location.hash.substring(1);
    if (pasteData) {
      try {
        const plainText = await DecryptPaste(
          DearmorValue(pasteData.paste),
          DearmorValue(keyString),
          DearmorValue(pasteData.iv),
          password,
        );
        decryptSuccess(
          DearmorValue(keyString),
          String.fromCharCode(...plainText),
        );
      } catch (error) {
        decryptFailed();
      }
    }
  };

  useEffect(() => {
    if (loadState == PasteLoadState.PENDING) {
      fetchPasteData();
    }
    if (loadState == PasteLoadState.SUCCESS) {
      if (decryptState == PasteDecryptionState.PENDING) {
        decodeCipher();
      }
    }
    if (decryptState == PasteDecryptionState.SUCCESS) {
      updateViewCount();
    }
    return () => {};
  }, [loadState, decryptState]);

  if (
    loadState == PasteLoadState.FAILED ||
    decryptState == PasteDecryptionState.FAILED
  ) {
    return <PasteNotFound />;
  }
  if (loadState == PasteLoadState.PENDING) {
    return <h1>Loading...</h1>;
  }
  if (
    loadState == PasteLoadState.SUCCESS &&
    decryptState == PasteDecryptionState.PENDING
  ) {
    return <h1>Decoding...</h1>;
  }
  return (
    <>
      <div className="space-y-4 p-4 min-h-full grow max-w-6xl">
        <Card>
          <CardContent className="min-h-170 whitespace-pre">
            {plainText}
          </CardContent>
        </Card>
        <div className="flex justify-start">
          <Button className="w-full md:w-30" onClick={toggleDelete}>
            Delete
          </Button>
        </div>
      </div>
      <EnterPasswordDialog />
      <DeleteModal />
    </>
  );
};

export default PasteView;
