import { ListItems } from '../../models/list.items.model';

export class ListIngredientService {
    private ingredients: ListItems[] = [];

    addItem( name: string, amount: number, urgencia?: string, categoria?: string, id?: number) {
      let exists = false;
      this.ingredients.some(function (elem, i) {
          return elem.id_ingredient === id ?  exists = true : false;
      }); 
      
      if (!exists){
          this.ingredients.push(new ListItems( name, amount, urgencia, categoria, id));
          return true;    
      }
      else {
          return false;
      }
    }

    addItems(items: ListItems[]) {
      this.ingredients.push(...items);
      // console.log(this.ingredients);
    }

    getItems() {
      return this.ingredients.slice();
    }

    updateItem (index: number, ingredient: ListItems){
      this.ingredients[index] = ingredient;
    }
    
    removeItem(idOrIndex, type: string) {
      if ( type == 'id'){
          let index;
          this.ingredients.some(function (elem, i) {
              return elem.id_ingredient === idOrIndex ? (index = i, true) : false;
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
