import { Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommentService } from '../../../core/services/comment.service';
import { ToastService } from '../../../core/services/toast.service';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

/** Interactive comment section with replies, shown on the details page. */
@Component({
  selector: 'app-comment-section',
  imports: [ReactiveFormsModule, RouterLink, TimeAgoPipe],
  templateUrl: './comment-section.html',
  styleUrl: './comment-section.scss',
})
export class CommentSection {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly commentService = inject(CommentService);
  private readonly toast = inject(ToastService);

  readonly listingId = input.required<string>();

  readonly comments = computed(() => this.commentService.commentsFor(this.listingId()));

  readonly currentUser = this.auth.currentUser;

  readonly commentForm = this.fb.nonNullable.group({
    text: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
  });

  readonly replyingTo = signal<string | null>(null);
  readonly replyForm = this.fb.nonNullable.group({
    text: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
  });

  addComment(): void {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }
    const user = this.currentUser();
    if (!user) {
      return;
    }
    this.commentService.add(this.listingId(), user, this.commentForm.getRawValue().text);
    this.commentForm.reset();
    this.toast.success('Comment posted.');
  }

  startReply(commentId: string): void {
    this.replyingTo.set(commentId);
    this.replyForm.reset();
  }

  cancelReply(): void {
    this.replyingTo.set(null);
  }

  submitReply(parentId: string): void {
    if (this.replyForm.invalid) {
      this.replyForm.markAllAsTouched();
      return;
    }
    const user = this.currentUser();
    if (!user) {
      return;
    }
    this.commentService.add(this.listingId(), user, this.replyForm.getRawValue().text, parentId);
    this.replyForm.reset();
    this.replyingTo.set(null);
    this.toast.success('Reply posted.');
  }

  invalid(control: { invalid: boolean; touched: boolean }): boolean {
    return control.invalid && control.touched;
  }
}
