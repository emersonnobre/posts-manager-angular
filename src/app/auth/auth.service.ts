import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResponseApi } from "../shared/models/response-api.model";
import { AuthData } from "./auth-data.model";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl: string = "http://localhost:3338/api/user";
    private token: string;

    constructor(private http: HttpClient) {}

    getToken(): string {
        return this.token;
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
        this.http.post(`${this.baseUrl}/login`, authData)
            .subscribe(response => {

            });
    }
}