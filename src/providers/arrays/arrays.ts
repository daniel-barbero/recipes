export class ArraysService {
  private arrayElement = [];

  addItem(newElement) {
    this.arrayElement.push(newElement);
    console.log('arrayService: ' + this.arrayElement);
  }

  addItems(items) {
    this.arrayElement.push(...items);
  }

  getItems() {
    return this.arrayElement.slice();
  }

  removeItem(index: number) {
    this.arrayElement.splice(index, 1);
    console.log('arrayService: ' + this.arrayElement);
  }

  clearItems(){
    this.arrayElement = [];
  }
}
