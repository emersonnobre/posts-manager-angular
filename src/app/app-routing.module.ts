import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SigninComponent } from "./auth/components/signin/signin.component";
import { SignupComponent } from "./auth/components/signup/signup.component";
import { PostCreateComponent } from "./posts/components/post-create/post-create.component";
import { PostListComponent } from "./posts/components/post-list/post-list.component";
import { AuthGuard } from "./shared/auth.guard";


const routes: Routes = [
  { path: "", component: PostListComponent },
  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "edit/:id", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "login", component: SigninComponent },
  { path: "signup", component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }
