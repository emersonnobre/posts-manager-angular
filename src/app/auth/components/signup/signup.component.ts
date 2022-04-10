import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth.service";

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css', ],
})
export class SignupComponent implements OnInit, OnDestroy {
    isLoading = false;
    authListener: Subscription;

    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.authListener = this.authService.getAuthListener().subscribe({
            next: () => {
                this.isLoading = false;
            },
        });
    }

    onSignup(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.isLoading = true;
        this.authService.createUser(form.value.email, form.value.password);
    }

    ngOnDestroy(): void {
        this.authListener.unsubscribe();
    }
}