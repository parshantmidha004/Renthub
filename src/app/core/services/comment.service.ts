import { Injectable, inject, signal } from '@angular/core';
import { Comment, CommentNode } from '../models/comment.model';
import { StorageService } from './storage.service';

const COMMENTS_KEY = 'renthub.comments';

/**
 * Interactive comment section per listing with one level of replies,
 * enabling transparent discussions between renters and landlords.
 */
@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly storage = inject(StorageService);

  readonly comments = signal<Comment[]>(this.storage.read<Comment[]>(COMMENTS_KEY, []));

  commentsFor(listingId: string): CommentNode[] {
    const forListing = this.comments()
      .filter((c) => c.listingId === listingId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const topLevel = forListing.filter((c) => c.parentId === null);
    return topLevel.map((comment) => ({
      comment,
      replies: forListing
        .filter((c) => c.parentId === comment.id)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    }));
  }

  repliesFor(listingId: string, parentId: string): Comment[] {
    return this.comments()
      .filter((c) => c.listingId === listingId && c.parentId === parentId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  countFor(listingId: string): number {
    return this.comments().filter((c) => c.listingId === listingId).length;
  }

  add(
    listingId: string,
    author: { id: string; name: string },
    text: string,
    parentId: string | null = null,
  ): Comment {
    const comment: Comment = {
      id: crypto.randomUUID(),
      listingId,
      parentId,
      authorId: author.id,
      authorName: author.name,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    this.comments.update((list) => [...list, comment]);
    this.storage.write(COMMENTS_KEY, this.comments());
    return comment;
  }

  remove(id: string): void {
    this.comments.update((list) => list.filter((c) => c.id !== id && c.parentId !== id));
    this.storage.write(COMMENTS_KEY, this.comments());
  }
}
