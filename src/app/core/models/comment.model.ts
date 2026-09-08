export interface Comment {
  id: string;
  listingId: string;
  parentId: string | null;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

/** A top level comment together with its nested replies. */
export interface CommentNode {
  comment: Comment;
  replies: Comment[];
}
