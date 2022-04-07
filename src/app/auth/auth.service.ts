import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl: string = 'http://localhost:3338/api/user'
    constructor(private http: HttpClient) {}

    createUser(email: string, password: string) {
        const authData: AuthData = {email: email, password: password};
        this.http.post(`${this.baseUrl}/signup`, authData)
            .subscribe(response => {
                console.log(response);
            });
    }
}