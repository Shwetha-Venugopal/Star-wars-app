import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  apiUrl='https://swapi.dev/api'
  constructor(public http:HttpClient) { }

  getCharacters(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/people/`);
  }

  getCharacter(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/people/${id}/`);
  }

  getSpeciesName(url: string): Observable<string> {
    return this.http.get<any>(url).pipe(
      map(response => response.name),
      catchError((err) => {
        console.error('Error fetching species name', err);
        return of('unknown');
      })
    );
  }

  

  getVehicalList(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  getSpeciees(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  getFilm(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  getSpeiees(url: string): Observable<any> {
    console.log(url)
    return this.http.get<any>(url);
  }

  getStarship(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
  

  getMovies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/films/`);
  }

  getSpecies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/species/`);
  }

  getSpeciesByUrl(url:any): Observable<any> {
    return this.http.get<any>(url);
  }

  getSpeciesbyUrl(url:any): Observable<any> {
    return this.http.get<any>(url);
  }

  getMovie(url:any): Observable<any>{
    return this.http.get<any>(url);
  }

  getVehical(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/vehicles/`);
  }

  getStarships(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/starships/`);
  }



}
