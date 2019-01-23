import { Ingredient } from '../../models/ingredient.model';

export class ShoppingListService {
    private ingredients: Ingredient[] = [];

    addItem(name: string, amount: string, urgencia?: string, categoria?: string) {
      this.ingredients.push(new Ingredient(name, amount, urgencia, categoria));
    }

    addItems(items: Ingredient[]) {
      this.ingredients.push(...items);
    }

    getItems() {
      return this.ingredients.slice();
    }

    updateItem (index: number, ingredient: Ingredient){
      this.ingredients[index] = ingredient;
    }
    
    removeItem(idOrIndex, type: string) {
      if ( type == 'id'){
          let index;
          this.ingredients.some(function (elem, i) {
              return elem.id === idOrIndex ? (index = i, true) : false;
          }); 
          this.ingredients.splice(index, 1);
      }
      else {
         //type = index
          this.ingredients.splice(idOrIndex, 1);
      }
      
    }

    clearItems() {
      this.ingredients = [];
    }

}
