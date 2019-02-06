export class Ingredient  {
    
    name: string;
    categoria: string;
    id: string;
    
    constructor(name: string, categoria?:string, id?: string ) {
        this.name = name;
        this.categoria = (categoria === undefined ) ? 'null' : categoria;
        this.id = id;
    } 
}
