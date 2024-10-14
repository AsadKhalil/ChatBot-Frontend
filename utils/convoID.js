import Cookies from "js-cookie";

export const setConvoId = (convoId) => {
  Cookies.set("convoId", convoId, { path: "/" });
};

export const getConvoId = () => {
  return Cookies.get("convoId");
};

export const removeConvoId = () => {
  Cookies.remove("convoId");
};

export const setUserRole = (userRole) => {
  Cookies.set("user_role", userRole);
};

export const removeUserRole = () => {
  Cookies.remove("user_role");
};
