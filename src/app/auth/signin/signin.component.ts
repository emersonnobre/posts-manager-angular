import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css', ],
})
export class SigninComponent {
    isLoading = false;

    onLogin(form: NgForm) {
        console.log(form.value);
    }
}