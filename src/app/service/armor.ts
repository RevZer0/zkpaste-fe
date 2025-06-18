const ArmorValue = (value: Uint8Array): string => {
  return btoa(String.fromCharCode(...value));
};

const DearmorValue = (value: string): Uint8Array => {
  return Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
};

export { ArmorValue, DearmorValue };
