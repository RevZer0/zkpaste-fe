interface UpdateViewCountRequest {
  paste_id: string;
  signature: string;
}

const updateViewCountHandler = async (
  request: UpdateViewCountRequest,
): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/paste/${request.paste_id}/view`,
    {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(request),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to update views count");
  }
};

export { updateViewCountHandler };
