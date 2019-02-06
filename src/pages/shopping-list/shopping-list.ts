import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ItemSliding } from 'ionic-angular';
import { NgForm, FormControl } from "@angular/forms";

import { RecipesProvider } from '../../providers/recipes/recipes';
import { ListIngredientService } from '../../providers/ingredients/listIngredientService';

import { ListItems } from "../../models/list.items.model";
import { Ingredient } from '../../models/ingredient.model';


@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html'
})
export class ShoppingListPage {
  name: string = '';
  amount: number = 1;
  idIngredient: number;
  category: string = '';

  ingredients: Ingredient[];
  ingredientsView: Ingredient[];
  listItems: ListItems[];

  searchTerm: string = '';
  searchControl: FormControl;

  constructor(public navCtrl: NavController, 
              private recipesProvider: RecipesProvider,
              private slService: ListIngredientService,
              private loadingController: LoadingController,
              private alertCtrl : AlertController) {

        this.searchControl = new FormControl();
  }
  
  ionViewWillEnter() {
      console.log("ionViewWillEnter");
      this.onLoadData();
  }

  // 
  //       MANAGE ARRAY INGREDIENTS LIST - ListIngredientService
  //

  addItem(form: NgForm) {
      this.slService.addItem(form.value.name, form.value.amount, 'NO', form.value.category, form.value.idIngredient);
      form.reset({ amount: 1});
      this.loadItems();
  }

  removeItem(index: number) {
      this.slService.removeItem(index, 'index');
      this.loadItems();
  }

  urgentItem(index: number, ingredient: ListItems, slidingItem: ItemSliding) {
      slidingItem.close();
      console.log(ingredient.urgencia);
      ingredient.urgencia = (ingredient.urgencia == 'SI')? 'NO' : 'SI';
      this.slService.updateItem(index, ingredient);
  }

  loadItems() {
      this.listItems = this.slService.getItems();
      console.log(this.listItems);
  }

  // 
  //       SELECT INGREDIENT
  //

  onSearchInput(searchTerm){
      if ( searchTerm.length < 3 ){
          this.ingredientsView = this.ingredients;
      } 
      else {
          setTimeout(() => {
              this.ingredientsView = this.ingredientsView.filter((ingredient:Ingredient) => {
                  return ingredient.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
              });
          }, 500);
      }
  }

  selectIngredient(id:number, name:string, cat:string){
      event.preventDefault();
      this.name = name;
      this.idIngredient = id;
      this.category = cat;
  }

  // 
  //       SAVE FORM
  //

  saveData(ingredientsList: Array<ListItems>) {
      console.log(ingredientsList);

      this.recipesProvider.updateShopping(ingredientsList, 'shopping').subscribe(
          result => {
              if (result.includes('error')){
                  this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
              }
              else {
                  this.onAlertSuccess(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
              }    
          },
          error => {
              console.log(error);
          }
      );
  }

  onLoadData() {
      this.slService.clearItems();
      this.listItems = [];
      let loadingSpinner = this.loadingController.create({
        content: "Cargando"
      });

      loadingSpinner.present();
      this.recipesProvider.getList('shopping', 'all', 'id').subscribe(
          result => {
              if (typeof result === 'string'){
                  loadingSpinner.dismiss();
                  this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
              }
              else {
                  this.slService.addItems(result);
                  this.recipesProvider.getList('ingredients', 'all', 'name').subscribe(
                    result => {
                        if (typeof result === 'string'){
                            this.onAlertError(result.substring(result.lastIndexOf(':')+2, result.lastIndexOf('"')));
                        }
                        else {
                            this.ingredients = result;
                            
                            loadingSpinner.dismiss();
                            this.loadItems();
                        }
                    },
                    error => {
                        this.onAlertError(error);
                    }
                );

              }
          },
          error => {
              loadingSpinner.dismiss();
              this.onAlertError(error);
          }
      );
  }

  // 
  //       ALERTS
  //

  onAlertError(error) {
      const alert = this.alertCtrl.create({
          title: 'Error de acceso',
          message: error,
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                  this.onLoadData();
              }
            }
          ]
      });

      alert.present();
  }

  onAlertSuccess(msg) {
    const alert = this.alertCtrl.create({
        title: 'Lista de compra actualizada con éxito',
        message: msg,
        cssClass: 'alertOK',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
                this.navCtrl.pop();
            }
          }
        ]
    });
    
    alert.present();
  }

}
