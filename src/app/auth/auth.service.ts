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
    private tokenExpirationTimer: any;

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

    autoAuthUser(): void {
        const authData = this.getAuthDataInLocalStorage();
        if (!authData) {
            return null;
        }
        const now = new Date();
        const expiresIn = authData.tokenExpirationDate.getTime() - now.getTime();
        if (expiresIn <= 0) {
            return null;
        }
        this.token = authData.token;
        this.authStatus = true;
        this.authListener.next(true);
        this.setExpirationTokenTimer(expiresIn / 1000);
    }

    login(email: string, password: string): void {
        const authData: AuthData = {email: email, password: password};
        this.http.post<ResponseApi>(`${this.baseUrl}/login`, authData)
            .subscribe(response => {
                this.token = response.data.token;
                const expiresIn = response.data.expiresIn;
                this.setExpirationTokenTimer(expiresIn);
                if (this.token) {
                    this.authStatus = true;
                    this.authListener.next(true);
                    const now = new Date().getTime();
                    const tokenExpirationDate = new Date(now + expiresIn * 1000); 
                    this.saveAuthDataInLocalStorage(this.token, tokenExpirationDate);
                    this.router.navigateByUrl("/");
                }
            });
    }

    logout(): void {
        this.token = null;
        clearTimeout(this.tokenExpirationTimer);
        this.clearAuthDataFromLocalStorage();
        this.authStatus = false;
        this.authListener.next(false);
        this.router.navigateByUrl("/");
    }

    saveAuthDataInLocalStorage(token: string, tokenExpiration: Date): void {
        localStorage.setItem("token", token);
        localStorage.setItem("tokenExpiration", tokenExpiration.toString());
    }

    getAuthDataInLocalStorage(): {token: string, tokenExpirationDate: Date} {
        const token = localStorage.getItem("token");
        const tokenExpirationDate = localStorage.getItem("tokenExpiration");
        if (!token || !tokenExpirationDate) {
            return null;
        }
        return {
            token,
            tokenExpirationDate: new Date(tokenExpirationDate),
        };
    }

    clearAuthDataFromLocalStorage(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
    }

    setExpirationTokenTimer(expiresIn: number): void {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expiresIn * 1000);
    }
}