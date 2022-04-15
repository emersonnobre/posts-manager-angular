import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Post } from "./models/post.model";
import { ResponseApi } from "../auth/models/response-api.model";

@Injectable({
	providedIn: "root",
})
export class PostsService {
	private posts: Post[] = [];
	private postsUpdated = new Subject<{ posts: Post[]; maxPosts: number }>();
	private baseUrl: string = "http://localhost:3338/api/posts";

	constructor(private http: HttpClient, private router: Router) { }

	getPosts(pageSize: number, currentPage: number) {
		const queryParameters = `?pageSize=${pageSize}&currentPage=${currentPage}`;
		this.http.get<{ message: string; data: any; maxPosts: number }>(this.baseUrl + queryParameters)
			.pipe(map(({ data }) => {
				return {
					posts: data.posts.map(post => (
						{
							id: post._id,
							title: post.title,
							content: post.content,
							imagePath: post.imagePath,
							creator: post.creator,
						}
					)),
					maxPosts: data.count,
				}
			}))
			.subscribe(transformedPostData => {
				this.posts = transformedPostData.posts;
				this.postsUpdated.next({
					posts: [...this.posts],
					maxPosts: transformedPostData.maxPosts,
				});
			});
	}

	getPostUpdateListener() {
		return this.postsUpdated.asObservable();
	}

	getPost(id: string) {
		return this.http.get<ResponseApi>(`${this.baseUrl}/${id}`);
	}

	addPost(title: string, content: string, image: File): void {
		const postData = new FormData();
		postData.append("title", title);
		postData.append("content", content);
		postData.append("image", image, title);
		this.http.post<{ message: string; post: Post }>(this.baseUrl, postData)
			.subscribe(() => this.router.navigate(['/']));
	}

	updatePost(id: string, title: string, content: string, image: File | string) {
		let postData: any;
		if (typeof image === "object") {
			postData = new FormData();
			postData.append("id", id);
			postData.append("title", title);
			postData.append("content", content);
			postData.append("image", image, title);
			postData.append("creator", null);
		} else {
			postData = {
				id: id,
				title: title,
				content: content,
				imagePath: image,
				creator: null,
			};
		}
		this.http.put(`${this.baseUrl}/${id}`, postData).subscribe(() => {
			this.router.navigate(['/']);
		});
	}

	deletePost(id: string) {
		return this.http.delete(`${this.baseUrl}/${id}`);
	}
}
