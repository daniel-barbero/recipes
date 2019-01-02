import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Recipe } from '../../models/recipe.model';
import { InputRecipe } from '../inputRecipe/inputRecipe';

@Component({
    selector: 'page-recipe',
    templateUrl: 'recipe.html'
})

export class RecipePage implements OnInit {
    public recipe: Recipe;
    public urlImg ="http://recetas.danielbarbero.es/img/";
    public idRecipe: number;

    public inputRecipe = InputRecipe;

    constructor ( public navCtrl: NavController, 
                  private navParams: NavParams) {
    }

    ngOnInit(){
        console.log('onInit Recipe');
        this.recipe = this.navParams.data;
    }
    ionViewWillEnter(){
        console.log('ionViewWillEnter Recipe');
        this.recipe = this.navParams.data;
    }


}
