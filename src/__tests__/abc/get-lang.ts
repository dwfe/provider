import {User} from './user'

export const getLang = (user: User) => user?.lang || 'en';
