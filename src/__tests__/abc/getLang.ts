import {User} from './user';

export const getLang = (user: User): string => user?.lang || 'en';
