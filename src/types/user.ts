import { BaseEntity } from '@/types';

export interface User extends BaseEntity {
  id: string;
  email: string;
  name: string;
  avatar: string;
  phone: string;
  gender: 'male' | 'female';
}
