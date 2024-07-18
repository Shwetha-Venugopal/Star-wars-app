import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Routes } from '@angular/router'; 
import { CharacterListComponent } from './character-list/character-list.component';
import { CharacterDetailComponent } from './character-detail/character-detail.component';

  const routes: Routes = [
    { path: '', component: CharacterListComponent , children:[
      { path: 'characters/:id', component: CharacterDetailComponent }
    ]},
  ];




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
    
  ]
})
export class AppRoutingModule { }
