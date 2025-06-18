interface PasteMetadata {
  password_protected: boolean;
  open_counts?: number;
  ttl?: number;
}

interface CreatePasteRequest {
  iv: string;
  ciphertext: string;
  signature: string;
  metadata: PasteMetadata;
}

interface CreatePasteRespose {
  paste_id: string;
}

const createPasteHandler = async (
  request: CreatePasteRequest,
): Promise<CreatePasteRespose> => {
  const failedError = new Error("Failed to create paste");
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/paste`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw failedError;
  }
  const json = await response.json();
  if (!json.paste_id) {
    throw failedError;
  }
  return json;
};

export { createPasteHandler };
