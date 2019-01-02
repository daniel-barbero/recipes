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
    
    removeItem(index: number) {
      this.ingredients.splice(index, 1);
    }

    clearItems() {
      this.ingredients = [];
    }
}
