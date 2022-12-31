import { BaseEntity } from '@/types';

export interface Organization extends BaseEntity {
  id: string;
  name: string;
  slug: string;
}
