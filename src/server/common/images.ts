export const AVATAR_URL = "https://avatar.vercel.sh";

export const imageUrl = (email: string, name: string): string => {
  const nameParts = name.trim().split(" ", 2);

  let text = "";
  if (nameParts.length == 2) {
    if (nameParts[0] != undefined) {
      text += [...nameParts[0]].at(0);
    }

    if (nameParts[1] != undefined) {
      text += [...nameParts[1]].at(0);
    }
  } else {
    text = [...name]?.at(0) || "";
  }

  if (text.length == 1) text += " ";
  return encodeURI(
    `${AVATAR_URL}/${email}.svg?${!name ? "?" : "&text=" + text.toUpperCase()}`
  );
};
