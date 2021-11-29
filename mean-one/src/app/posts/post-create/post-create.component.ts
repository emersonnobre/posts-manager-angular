import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

import { Post } from '../post.model'
import { PostsService } from "../posts.service";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  postCreated: Post = {
    title: '',
    content: ''
  }

  constructor(public postsService: PostsService) {}

  onAddPost(postForm: NgForm): void {
    if (postForm.invalid) return
    const post: Post = {
      title: postForm.value.title,
      content: postForm.value.content
    }
    this.postsService.addPost(post)
    postForm.resetForm()
  }
}
