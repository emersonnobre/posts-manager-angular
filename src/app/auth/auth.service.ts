import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { ResponseApi } from "../shared/models/response-api.model";
import { AuthData } from "./auth-data.model";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl: string = "http://localhost:3338/api/user";
    private authStatus = false;
    private authListener = new Subject<boolean>();
    private token: string;

    constructor(private http: HttpClient, private router: Router) {}

    getToken(): string {
        return this.token;
    }

    getAuthStatus(): boolean {
        return this.authStatus;
    }

    getAuthListener(): Observable<boolean> {
        return this.authListener.asObservable();
    }

    createUser(email: string, password: string): void {
        const authData: AuthData = {email: email, password: password};
        this.http.post<ResponseApi>(`${this.baseUrl}/signup`, authData)
            .subscribe(response => {
                this.token = response.data.token;
            });
    }

    login(email: string, password: string): void {
        const authData: AuthData = {email: email, password: password};
        this.http.post<ResponseApi>(`${this.baseUrl}/login`, authData)
            .subscribe(response => {
                this.token = response.data.token;
                if (this.token) {
                    this.authStatus = true;
                    this.authListener.next(true);
                    this.router.navigateByUrl("/");
                }
            });
    }

    logout(): void {
        this.token = null;
        this.authStatus = false;
        this.authListener.next(false);
        this.router.navigateByUrl("/");
    }
}