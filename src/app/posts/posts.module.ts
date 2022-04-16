import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AngularMaterialModule } from "../angular-material.module";
import { PostCreateComponent } from "./components/post-create/post-create.component";
import { PostListComponent } from "./components/post-list/post-list.component";

@NgModule({
    declarations: [
        PostListComponent,
        PostCreateComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule,
    ],
})
export class PostsModule {

}