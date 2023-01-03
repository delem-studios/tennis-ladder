import { Thread } from '@/features/comments';
import { BaseEntity, Expand, User } from '@/types';

export interface CommentType extends BaseEntity {
  thread: string;
  owner: string;
  message: string;
}

export type ExpandedComment = Expand<
  CommentType,
  { thread: Thread; owner: User }
>;
