import Cookies from 'js-cookie';

export const setHRConvoId = (convoId) => {
    Cookies.set('hrconvoId', convoId, { path: '/' });
};


export const getHRConvoId = () => {
  return Cookies.get('hrconvoId');
};


export const removeHRConvoId = () => {
  Cookies.remove('hrconvoId');
};