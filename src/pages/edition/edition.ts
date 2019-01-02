import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController, reorderArray  } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { ArraysService } from '../../providers/arrays/arrays';

@Component({
    selector: 'page-edition',
    templateUrl: 'edition.html'
})

export class EditionPage implements OnInit {
    arrayElements = [];
    title: string;

    constructor ( private navParams: NavParams,
                  private viewCtrl: ViewController,
                  private arrayService: ArraysService) {
    }

    ngOnInit(){

        if (this.navParams.data.stringField != ''){
            this.arrayElements = this.navParams.data.stringField.split(this.navParams.data.split);
            this.arrayService.addItems(this.arrayElements);
        }

        this.title = this.navParams.data.type;
        console.log('ngOnInit EDITION: ' + this.arrayElements);
    }

    ionViewWillEnter() {
        this.loadItems();
    }
    
    saveArrayElements(){
        this.viewCtrl.dismiss({'type': this.title, 'content': this.arrayElements});
    }

    private loadItems(){
        this.arrayElements = this.arrayService.getItems();
    }

    onAddItem(form: NgForm){
        this.arrayService.addItem(form.value.itemName);
        form.reset();
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

    onClose(){
        this.viewCtrl.dismiss();
    }

    ionViewWillUnload() {
        console.log('ionViewWillUnload EDITION');
        this.arrayService.clearItems();
    }

}
