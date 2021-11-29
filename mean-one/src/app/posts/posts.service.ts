import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";
import { Post } from "./post.model";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = []
  private postsUpdated = new Subject<Post[]>()
  private baseUrl: string = 'http://localhost:3000/api/posts'

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>(this.baseUrl)
      .subscribe((postData) => {
        this.posts = postData.posts
        this.postsUpdated.next([...this.posts])
      })
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable()
  }

  addPost(post: Post): void {
    this.http.post<{message: string}>(this.baseUrl, post)
      .subscribe((responseData) => {
        console.log(responseData.message)
        this.posts.push(post)
        this.postsUpdated.next([...this.posts])
      })
  }
}
