import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  private mode: string = 'create';
  isLoading = false;
  private id: string;
  post: Post;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.id = paramMap.get('id');
        this.isLoading = true;
        this.postsService.getPost(this.id).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
          };
        });
      } else {
        this.mode = 'create';
        this.id = null;
      }
    });
  }

  onSavePost(postForm: NgForm): void {
    if (postForm.invalid) return;
    this.isLoading = true;
    const post: Post = {
      id: this.id,
      title: postForm.value.title,
      content: postForm.value.content,
    };
    if (this.mode === 'create') this.postsService.addPost(post);
    else this.postsService.updatePost(post);
    postForm.resetForm();
  }
}
