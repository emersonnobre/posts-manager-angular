import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { ResponseApi } from "./models/response-api.model";
import { AuthData } from "./models/auth-data.model";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl: string = `${environment.apiUrl}/user`;
    private authStatus = false;
    private authListener = new Subject<boolean>();
    private token: string;
    private tokenExpirationTimer: any;
    private userId: string;

    constructor(private http: HttpClient, private router: Router) { }

    getToken(): string {
        return this.token;
    }

    getAuthStatus(): boolean {
        return this.authStatus;
    }

    getAuthListener(): Observable<boolean> {
        return this.authListener.asObservable();
    }

    getUserId(): string {
        return this.userId;
    }

    createUser(email: string, password: string): void {
        const authData: AuthData = { email: email, password: password };
        this.http.post<ResponseApi>(`${this.baseUrl}/signup`, authData)
            .subscribe({
                next: response => {
                    this.token = response.data.token;
                    this.router.navigateByUrl("/login");
                },
                error: () => {
                    this.authListener.next(false);
                },
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
        this.userId = authData.userId;
        this.authStatus = true;
        this.authListener.next(true);
        this.setExpirationTokenTimer(expiresIn / 1000);
    }

    login(email: string, password: string): void {
        const authData: AuthData = { email: email, password: password };
        this.http.post<ResponseApi>(`${this.baseUrl}/login`, authData)
            .subscribe(response => {
                this.token = response.data.token;
                this.userId = response.data.userId;
                const expiresIn = response.data.expiresIn;
                this.setExpirationTokenTimer(expiresIn);
                if (this.token) {
                    this.authStatus = true;
                    this.authListener.next(true);
                    const now = new Date().getTime();
                    const tokenExpirationDate = new Date(now + expiresIn * 1000);
                    this.saveAuthDataInLocalStorage(this.token, tokenExpirationDate, this.userId);
                    this.router.navigateByUrl("/");
                }
            });
    }

    logout(): void {
        this.token = null;
        this.userId = null;
        clearTimeout(this.tokenExpirationTimer);
        this.clearAuthDataFromLocalStorage();
        this.authStatus = false;
        this.authListener.next(false);
        this.router.navigateByUrl("/");
    }

    saveAuthDataInLocalStorage(token: string, tokenExpiration: Date, userId: string): void {
        localStorage.setItem("token", token);
        localStorage.setItem("tokenExpiration", tokenExpiration.toString());
        localStorage.setItem("userId", userId);
    }

    getAuthDataInLocalStorage(): { token: string, tokenExpirationDate: Date, userId: string } {
        const token = localStorage.getItem("token");
        const tokenExpirationDate = localStorage.getItem("tokenExpiration");
        const userId = localStorage.getItem("userId");
        if (!token || !tokenExpirationDate || !userId) {
            return null;
        }
        return {
            token,
            tokenExpirationDate: new Date(tokenExpirationDate),
            userId,
        };
    }

    clearAuthDataFromLocalStorage(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        localStorage.removeItem("userId");
    }

    setExpirationTokenTimer(expiresIn: number): void {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expiresIn * 1000);
    }
}