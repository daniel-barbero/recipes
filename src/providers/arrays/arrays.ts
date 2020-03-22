export class ArraysService {
  private arrayElement = [];

  addItem(newElement) {
    this.arrayElement.push(newElement);
    console.log('arrayService: '); 
    console.log(this.arrayElement);
  }

  addItems(items) {
    this.arrayElement.push(...items);
  }

  getItems() {
    return this.arrayElement.slice();
  }

  updateItem(index: number, action:string ){
    console.log(this.arrayElement[index]);
    let quantity = Number(this.arrayElement[index].quantity)
    if (action =='less' && quantity != 0){
      this.arrayElement[index].quantity = quantity-1;
    }
    else if (action =='more'){
      this.arrayElement[index].quantity = quantity+1;
    }
    
    console.log(this.arrayElement[index].quantity);
  }

  removeItem(index: number) {
    this.arrayElement.splice(index, 1);
    console.log('arrayService: '); 
    console.log(this.arrayElement);
  }

  clearItems() {
    this.arrayElement = [];
  }
}
