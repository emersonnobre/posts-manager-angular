import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";
import { SigninComponent } from "./components/signin/signin.component";
import { SignupComponent } from "./components/signup/signup.component";

@NgModule({
    declarations: [SigninComponent, SignupComponent],
    imports: [
        CommonModule,
        AngularMaterialModule,
        FormsModule,
    ],
})
export class AuthModule {}