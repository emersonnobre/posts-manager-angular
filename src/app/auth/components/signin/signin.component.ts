import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../auth.service";

@Component({
    templateUrl: './signin.component.html',
    styleUrls: ["./signin.component.css", ],
})
export class SigninComponent {
    isLoading = false;

    constructor(private authService: AuthService) {}

    onLogin(form: NgForm) {
        this.authService.login(form.value.email, form.value.password);
    }
}