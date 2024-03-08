import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Post } from './post';
import { WordTransformationPipe } from './pipes/word-transformation.pipe';
import { PostsService } from './services/posts.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    CommonModule,
    FormsModule,
    WordTransformationPipe
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  httpClient = inject(HttpClient);
  postsService = inject(PostsService);

  @ViewChild('title') title!: ElementRef;
  @ViewChild('content') content!: ElementRef;
  error: null | { denied: string; authorization: string } = null;
  errorSub: Subscription = new Subscription();

  loadedPosts: Post[] = [];
  isFetching: boolean = false;
  private isFetchingSub: Subscription = new Subscription();

  ngOnInit() {
    this.postsService.fetchPost().subscribe(
      (posts) => {
        this.loadedPosts = posts;
        this.isFetching = false;
      },
      (error) => {
        this.error = {
          denied: error.error['error'],
          authorization: error.statusText,
        };
        this.isFetching = false;
      }
    );

    this.isFetchingSub = this.postsService.isFetchingChanged.subscribe(
      (isFetchingDone: boolean) => (this.isFetching = isFetchingDone)
    );

    this.errorSub = this.postsService.error.subscribe((errorData) => {
      this.error = {
        denied: errorData.denied,
        authorization: errorData.authorization,
      }
    })
  }

  onCreatePost(postData: Post) {
    this.postsService.createAndStorePost(postData);
    this.title.nativeElement.value = '';
    this.content.nativeElement.value = '';
  }

  onFetchPosts() {
    // Send Http request
    this.postsService.fetchPost().subscribe(
      (posts) => {
        this.loadedPosts = posts;
        this.isFetching = false;
      },
      (error) => {
        this.error = {
          denied: error.error['error'],
          authorization: error.statusText,
        };
        this.isFetching = false;
      }
    );
  }

  onClearPosts() {
    // Send Http request
    this.isFetching = true;
    this.postsService.deletePosts().subscribe(() => {
      this.isFetching = false;
      this.loadedPosts = [];
    });
  }

  ngOnDestroy(): void {
    this.isFetchingSub.unsubscribe();

    this.errorSub.unsubscribe();
  }

  onDeleteASpecificPost(postId: string, liElement: HTMLLIElement) {
    liElement.style.transition = '0.5s linear';
    liElement.style.transform = 'translateX(100%)';

    this.postsService.deleteSpecificPost(postId).subscribe(() => {
      this.loadedPosts = this.loadedPosts.filter((post) => post.id !== postId);
    });
  }

  onHandleError() {
    this.error = null
  }
}
