import { Component } from '@angular/core';
import { SwapiService } from '../services/swapi.service';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, filter, forkJoin, map, Observable, of, tap } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent {
  characters: any
  displayedColumns: any
  selectedDate: Date | null = null;
  isDetailView = false
  dataSource: any
  species: any

  constructor(private swapiService: SwapiService, private router: Router) {
    this.dataSource = new MatTableDataSource(this.characters);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isDetailView = event.url.includes('characters/');
      }
    });
  }



  ngOnInit(): void {
    this.displayedColumns = ['no', 'name', 'species', 'birth_year'];

    this.swapiService.getCharacters().subscribe((data) => {
        const characters = data.results;
        const speciesUrls = characters.flatMap((character: any) => character.species);
        if (speciesUrls.length > 0) {
            const speciesRequests = speciesUrls.map((url: string) => this.swapiService.getSpeciesByUrl(url));
            
            forkJoin(speciesRequests).subscribe((speciesResponses:any) => {
                const speciesMap = new Map<string, string>();
                speciesResponses.forEach((species: any) => {
                    speciesMap.set(species.url, species.name);
                });
                this.characters = characters.map((character: any, index: any) => ({
                    no: index + 1,
                    name: character.name,
                    species: character.species.length > 0 ? speciesMap.get(character.species[0]) : '',
                    birth_year: character.birth_year,
                    url: character.url,
                }));

                this.dataSource.data = this.characters;
            });
        } else {
            this.characters = characters.map((character: any, index: any) => ({
                no: index + 1,
                name: character.name,
                species: '',
                birth_year: character.birth_year,
                url: character.url,
            }));
            this.dataSource.data = this.characters;
        }
    });
}

  loadCharacters(): void {
    this.swapiService.getCharacters().pipe(
      map((data: any) => {
        const characterObservables: Observable<any>[] = data.results.map((character: any, index: any) => {
          const speciesObservables: Observable<any>[] = character.species.map((specieUrl: string) =>

            console.log('hello')
          );

          const moviesObservables: Observable<any>[] = character.films.map((filmUrl: string) =>
            this.swapiService.getMovie(filmUrl)
          );

          return forkJoin([forkJoin(speciesObservables), forkJoin(moviesObservables)]).pipe(
            map(([speciesData, moviesData]: [any[], any[]]) => ({
              no: index + 1,
              name: character.name,
              // species: speciesData.map((species: any) => species.name).join(', '),
              movies: moviesData.map((movie: any) => movie.title).join(', '),
              birth_year: character.birth_year,
              url: character.url,
            }))
          );
        });

        return forkJoin(characterObservables);
      }),
      catchError(() => of([]))
    ).subscribe((characters: any) => {
      this.dataSource.data = characters;
    });
  }



  applyFilter(eve: any) {
    let { starships, vehical, Species, movie } = eve;
    starships = starships ? Number(starships) : null;
    vehical = vehical ? Number(vehical) : null;
    Species = Species ? Number(Species) : null;
    movie = movie ? Number(movie) : null;

    this.swapiService.getCharacters().pipe(
        map(data => data.results.filter((character: any) => {
            const hasStarship = starships !== null ? character.starships.includes(`https://swapi.dev/api/starships/${starships}/`) : true;
            const hasVehicle = vehical !== null ? character.vehicles.includes(`https://swapi.dev/api/vehicles/${vehical}/`) : true;
            const hasSpecies = Species !== null ? character.species.includes(`https://swapi.dev/api/species/${Species}/`) : true;
            const hasMovie = movie !== null ? character.films.includes(`https://swapi.dev/api/films/${movie}/`) : true;

            return hasStarship && hasVehicle && hasSpecies && hasMovie;
        }))
    ).subscribe(filteredCharacters => {
        const speciesUrls = filteredCharacters.flatMap((character: any) => character.species);

        if (speciesUrls.length > 0) {
            const speciesRequests = speciesUrls.map((url: string) => this.swapiService.getSpeciesByUrl(url));

            forkJoin(speciesRequests).subscribe((speciesResponses:any) => {
                const speciesMap = new Map<string, string>();
                speciesResponses.forEach((species: any) => {
                    speciesMap.set(species.url, species.name);
                });
                this.characters = filteredCharacters.map((character: any, index: any) => ({
                    no: index + 1,
                    name: character.name,
                    species: character.species.length > 0 ? speciesMap.get(character.species[0]) : '',
                    birth_year: character.birth_year,
                    url: character.url,
                }));

                this.dataSource.data = this.characters;
            });
        } else {
            this.characters = filteredCharacters.map((character: any, index: any) => ({
                no: index + 1,
                name: character.name,
                species: '',
                birth_year: character.birth_year,
                url: character.url,
            }));
            this.dataSource.data = this.characters;
        }
    });
}



  onActivate() {
    this.isDetailView = true;
  }






}


