import { Component, EventEmitter, Output } from '@angular/core';
import { SwapiService } from '../services/swapi.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-character-filter',
  templateUrl: './character-filter.component.html',
  styleUrls: ['./character-filter.component.scss']
})
export class CharacterFilterComponent {
  moviesList:any
  birthYearStart = this.convertBirthYear('30 BBY');
  birthYearEnd = this.convertBirthYear('5 ABY');
  selectedDate: Date | null = null;
  spaceLists:any
  vehicalLists:any
  starShipLists:any
  @Output() filterChanged = new EventEmitter<any>();
  charecterFilterForm:FormGroup
  constructor(public swapiService:SwapiService,public fb:FormBuilder){
    this.charecterFilterForm=this.fb.group({
      starships:[],
      vehical:[],
      Species:[],
      movie:[]
    })

  }

  convertBirthYear(year: string): number {
    if (year.endsWith('BBY')) {
      return -parseInt(year.replace('BBY', '').trim(), 10);
    } else if (year.endsWith('ABY')) {
      return parseInt(year.replace('ABY', '').trim(), 10);
    } else {
      return NaN;
    }
  }

  searchButton() {
    this.filterChanged.emit(this.charecterFilterForm.value);
  }

  extractId(url: string): string {
    return url.split('/').filter(part => part).pop() || '';
  }
  

  ngOnInit(){
    this.movieList()
    this.speciesList()
    this.vehicalList()
    this.getStartShip()
  }

  movieList(){
    this.swapiService.getMovies().subscribe((el)=>{
      this.moviesList=el.results
      console.log("this.moviesList", this.moviesList)
    })
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.selectedDate = event.value;
  }

  dateFilter = (date: Date | null): boolean => {
    const year = date ? date.getFullYear() : null;
    return year ? year >= this.birthYearStart && year <= this.birthYearEnd : false;
  };

  speciesList(){
    this.swapiService.getSpecies().subscribe((el)=>{
      this.spaceLists=el.results
      console.log("this.spaceList", this.spaceLists)
    })
  }

  vehicalList(){
    this.swapiService.getVehical().subscribe((el)=>{
      this.vehicalLists=el.results
      console.log("this.vehicalLists", this.vehicalLists)
    })
  }

  getStartShip(){
    this.swapiService.getStarships().subscribe((el)=>{
      this.starShipLists=el.results
      console.log("this.starShipLists", this.vehicalLists)
    })
  }

}
