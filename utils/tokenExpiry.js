import Cookies from 'js-cookie';
import { stringify } from 'querystring';

export const setExpiry = (expirationTime) => {
    Cookies.set('expires', expirationTime);
  };
  
  export const getExpiry = () => {
    return Cookies.get('expires');
  };