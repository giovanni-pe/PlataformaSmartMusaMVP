import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth/login`; 
  private jwtHelper = new JwtHelperService();
  private userEmail: string | null = null;
  private userRole: string | null = null;
  private userId: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  // Método para iniciar sesión y obtener el token JWT
  login(credentials: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return this.http.post<any>(this.apiUrl, credentials, httpOptions)
      .pipe(
        tap(response => {
          // Comprobar si la respuesta contiene un token válido
          if (response.access_token) {
            const token = response.access_token;
            localStorage.setItem('token', token);
            this.decodeToken(token);  // Decodificar el token para extraer la información del usuario
          } else {
            throw new Error('Login failed');
          }
        })
      );
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    this.userEmail = null;
    this.userRole = null;
    this.userId = null;
    this.router.navigate(['/login']);
  }

  // Verificar si el usuario ha iniciado sesión
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  // Obtener el token del almacenamiento local
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Decodificar el token JWT y almacenar los datos del usuario en el localStorage
  decodeToken(token: string) {
    const decodedToken = this.jwtHelper.decodeToken(token);
    this.userEmail = decodedToken['email'] || null; // Extraer directamente el email
    this.userRole = decodedToken['role'] || null;   // Extraer directamente el rol
    this.userId = decodedToken['sub'] || null;      // Extraer directamente el ID (sub = subject)
    localStorage.setItem('userId', this.userId || '');
    localStorage.setItem('userEmail', this.userEmail || '');
    localStorage.setItem('userRole', this.userRole || '');
    console.log(this.userRole); // Debug: Ver el rol del usuario en la consola
  }

  // Cargar la información del usuario desde el localStorage
  loadUserFromStorage() {
    this.userId = localStorage.getItem('userId');
    this.userEmail = localStorage.getItem('userEmail');
    this.userRole = localStorage.getItem('userRole');
    console.log(localStorage.getItem('userRole')); // Debug: Ver el rol del usuario desde localStorage
  }

  // Obtener el ID del usuario
  getUserId(): string | null {
    return this.userId;
  }

  // Obtener el email del usuario
  getUserEmail(): string | null {
    return this.userEmail;
  }

  // Obtener el rol del usuario
  getUserRole(): string | null {
    return this.userRole;
  }
}
