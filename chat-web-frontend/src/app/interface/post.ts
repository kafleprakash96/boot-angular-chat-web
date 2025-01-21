import { User } from './user';

export interface Post {
    id: string;
  title: string;
  content: string;
  author: User;
  likes: number;
  comments: Comment[];
  createdAt: Date;
  isLiked?: boolean;
}

export interface Comment {
    id: string;
    title: string;
    content: string;
    author: string;
    likes: number;
    comments: Comment[];
    createdAt: Date;
    isLiked?: boolean;
    replies: Comment[];
}
