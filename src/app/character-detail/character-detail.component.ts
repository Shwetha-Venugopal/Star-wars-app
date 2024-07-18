import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwapiService } from '../services/swapi.service';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss']
})
export class CharacterDetailComponent {
  character:any
  starships$: Observable<string[]> = of([]);
  species$: Observable<string[]> = of([]);;
  films$: Observable<string[]> = of([]);
  vehicles$:Observable<string[]> = of([]);
  constructor(private route: ActivatedRoute, private swapiService: SwapiService,public router:Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.swapiService.getCharacter(id).subscribe(character => {
        this.character = character;
        const filmObservables: Observable<string>[] = character.vehicles.map((vehicleUrl: string) =>
          this.swapiService.getVehicalList(vehicleUrl).pipe(map((film: any) => film.name))
        );
        this.vehicles$ = forkJoin(filmObservables).pipe(
          catchError(() => of([])) 
        );

        const vehiclesObservables: Observable<string>[] = character.films.map((filmUrl: string) =>
          this.swapiService.getFilm(filmUrl).pipe(map((film: any) => film.title))
        );
        this.films$ = forkJoin(vehiclesObservables).pipe(
          catchError(() => of([])) 
        );

        const speciesObservables: Observable<string>[] = character.species.map((specieUrl: string) =>
          this.swapiService.getSpeiees(specieUrl).pipe(map((species: any) => species.name))
        );
        this.species$ = forkJoin(speciesObservables).pipe(
          catchError(() => of([])) 
        );

        
        const starshipObservables: Observable<string>[] = character.starships.map((starshipUrl: string) =>
          this.swapiService.getStarship(starshipUrl).pipe(map((starship: any) => starship.name))
        );
        this.starships$ = forkJoin(starshipObservables).pipe(
          catchError(() => of([])) 
        );
      });
    });
  }

 

  backToHomePage(){
    this.router.navigate(['/'])
  }
  


}
