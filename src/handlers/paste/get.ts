interface GetPasteRequest {
  paste_id: string;
}

interface GetPasteResponse {
  paste_id: string;
  paste: string;
  iv: string;
  password_protected: boolean;
}

const getPasteHandler = async (
  request: GetPasteRequest,
): Promise<GetPasteResponse> => {
  const pasteNotFoundError = new Error("Paste not found");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/paste/${request.paste_id}`,
    {
      headers: {
        "Content-type": "application/json",
      },
    },
  );
  if (!response.ok) {
    throw pasteNotFoundError;
  }
  const json = await response.json();
  return json;
};

export { getPasteHandler };
