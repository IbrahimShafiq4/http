import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject, throwError } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { Post } from '../post';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  
  error = new Subject<{authorization: string, denied: string}>()

  isFetchingDone: boolean = false;
  isFetchingChanged = new Subject<boolean>()
  
  constructor(private HttpClient: HttpClient) {}
  
  createAndStorePost(postData: { title: string; content: string }) {
    this.isFetchingDone = true;
    this.isFetchingChanged.next(this.isFetchingDone)
    this.HttpClient
      .post<{ name: string }>(
        'https://ng-complete-guide-1c52a-default-rtdb.firebaseio.com/posts.json',
        postData, 
        {
          observe: 'body'
        }
      )
      .subscribe((responseData) => {
        console.log(responseData['name'])
        this.isFetchingDone = false;
        this.isFetchingChanged.next(this.isFetchingDone)
      }, 
        error => this.error.next({
          denied: error.error['error'], 
          authorization: error.statusText
        })
      );
  }

  fetchPost() {
    this.isFetchingDone = true;
    this.isFetchingChanged.next(this.isFetchingDone);
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');
    return this.HttpClient
    .get<{ [key: string]: Post }>(
      'https://ng-complete-guide-1c52a-default-rtdb.firebaseio.com/posts.json',
      {
        headers: new HttpHeaders({
          'Custom-header': 'hello',
          name: 'ibrahim'
        }), 
        params: searchParams,
        context: new HttpContext(),
      }
    )
    .pipe(
      map(responseData => {
        const postsArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postsArray.push({ ...responseData[key], id: key });
          }
        }
        return postsArray;
      }),
      catchError(errorResponse => {
        return throwError(() => errorResponse);
      })
    )
  }

  deletePosts() {    
    return this.HttpClient.delete(
      'https://ng-complete-guide-1c52a-default-rtdb.firebaseio.com/posts.json',
      {
        observe: 'events'
      }
    ).pipe(
      tap(event => {
        console.log(event);

        if (event.type === HttpEventType.Sent) {
          // ...
        } 

        if (event.type === HttpEventType.Response) {
          console.log(event.body);
        }
      })
    )
  }

  deleteSpecificPost(postId: string) {
    return this.HttpClient.delete(
      `https://ng-complete-guide-1c52a-default-rtdb.firebaseio.com/posts/${postId}.json`
    )
  }
}