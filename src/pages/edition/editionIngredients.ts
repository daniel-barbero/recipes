import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController, reorderArray  } from 'ionic-angular';
//import { NgForm } from '@angular/forms';

import { RecipesProvider } from '../../providers/recipes/recipes';

import { ArraysService } from '../../providers/arrays/arrays';
import { Ingredient } from './../../models/ingredient.model';

@Component({
    selector: 'page-edition',
    templateUrl: 'editionIngredients.html'
})

export class EditionIngredients implements OnInit {
    arrayElements = [];
    title: string;
    ingredients: Ingredient[];
    ingredientsFiltered: Ingredient[];

    searchTerm: string;

    constructor ( private navParams: NavParams,
                  private viewCtrl: ViewController,
                  private arrayService: ArraysService,
                  private recipesProvider: RecipesProvider) {
    }

    ngOnInit(){

        if (this.navParams.data.stringField != ''){
            this.arrayElements = this.navParams.data.stringField;
            this.arrayService.addItems(this.arrayElements);
        }

        this.title = this.navParams.data.type;

        console.log('ngOnInit EDITION: '); 
        console.log(this.arrayElements);
    }

    ionViewWillEnter() {
        console.log('ionViewWillEnter EDITION: '); 
        this.loadItems();
        this.loadIngredients();

        console.log('ingredientes');
        console.log(this.ingredients);
    }
    
    saveArrayElements(){
        this.viewCtrl.dismiss({'type': this.title, 'content': this.arrayElements});
    }

    private loadItems(){
        this.arrayElements = this.arrayService.getItems();
    }

    loadIngredients(){
        console.log('loadIngredients FUNCTION');
        this.ingredients = [];

        this.recipesProvider.getList('ingredients', 'all', 'name').subscribe(
            result => {
                if (typeof result === 'string'){
                    console.log('error1');
                }
                else {
                    result.forEach(
                      element => {
                        this.ingredients.push(new Ingredient(element.id,
                                                  element.name,
                                                  element.categoria,
                                                  element.quantity,
                                                  element.quantityUnit ));
                      }
                    );
                }
                return true;
            },
            error => {
                console.log('error');
            }
        );
    }

    addIngredient(ingredient){
        console.log(ingredient);
        this.arrayService.addItem(ingredient);
        this.searchTerm = '';
        this.onCancel();
        this.loadItems();
    }
    /*
    onAddItem(form: NgForm){
        let ingredient = new Ingredient('1',form.value.itemName, 'Le', '1', '');
        this.arrayService.addItem(ingredient);
        form.reset();
        this.loadItems();
    }*/

    updateItem(index:number, action:string){
        this.arrayService.updateItem(index, action);
        this.loadItems();
    }

    deleteItem(index: number) {
        this.arrayService.removeItem(index);
        this.loadItems();
    }

    reorderItems(indexes) {
        this.arrayElements = reorderArray(this.arrayElements, indexes);
        console.log('ngOnInit EDITION: ' + this.arrayElements);
    }

    searchIngredient(searchTerm){
        console.log(searchTerm);
        if ( searchTerm.length >= 2 ){
            setTimeout(() => {
              this.ingredientsFiltered = this.ingredients.filter((ingredient:Ingredient) => {
                  return ingredient.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
              });
            }, 100);     
        }
    }

    onCancel(){
        console.log('onCancel SEARCH');
        this.ingredientsFiltered = [];
    }

    onClose(){
        this.viewCtrl.dismiss();
    }

    ionViewWillUnload() {
        console.log('ionViewWillUnload EDITION');
        this.arrayService.clearItems();
    }

}
