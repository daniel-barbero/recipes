export class ListItems  {
    
    name: string;
    amount: number;
    urgencia: string;
    categoria: string;
    id_ingredient: number;
    
    constructor(name: string, amount?: number, urgencia?:string, categoria?:string, id_ingredient?: number ) {
        this.name = name;
        this.amount = (amount === undefined ) ? 1 : amount;
        this.urgencia = (urgencia === undefined ) ? 'NO' : urgencia;
        this.categoria = (categoria === undefined ) ? 'null' : categoria;
        this.id_ingredient = id_ingredient;
    } 
}
