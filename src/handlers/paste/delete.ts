interface DeletePasteRequest {
  paste_id: string;
  signature: string;
}

const deletePasteHandler = async (
  request: DeletePasteRequest,
): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/paste/${request.paste_id}/delete`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(request),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to delete paste");
  }
};

export { deletePasteHandler };
