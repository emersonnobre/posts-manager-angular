import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private baseUrl: string = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(this.baseUrl)
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string}>
      (`${this.baseUrl}/${id}`);
  }

  addPost(post: Post): void {
    this.http
      .post<{ message: string; postId: string }>(this.baseUrl, post)
      .subscribe((responseData) => {
        post.id = responseData.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(post: Post) {
    this.http.put(`${this.baseUrl}/${post.id}`, post)
      .subscribe(() => {
        const oldPostIndex = this.posts.findIndex(oldPost => oldPost.id === post.id);
        this.posts[oldPostIndex] = post;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(id: string): void {
    this.http.delete(`${this.baseUrl}/${id}`).subscribe(() => {
      const updatedPosts = this.posts.filter((post) => post.id != id);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }
}
