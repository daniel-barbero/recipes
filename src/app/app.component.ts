import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// PAGES
import { HomePage } from '../pages/home/home';
import { PantryPage } from '../pages/pantry/pantry';
import { InputRecipe } from '../pages/inputRecipe/inputRecipe';
import { ShoppingListPage } from '../pages/shopping-list/shopping-list';
import { FridgePage } from '../pages/fridge/fridge';
import { NewIngredientPage } from '../pages/new-ingredient/new-ingredient';

@Component({
    templateUrl: 'app.html'
})

export class MyApp {
    @ViewChild('content') nav: Nav;

    rootPage: any = HomePage;
    pages: Array<{title: string, component: any, icon: string}>;

    constructor(
        public platform: Platform,
        public menu: MenuController,
        public statusBar: StatusBar,
        private splashScreen: SplashScreen
    ){

      this.splashScreen.show();
      this.initializeApp();
      
      // set our app's pages
      this.pages = [
          { title: 'Home', component: HomePage, icon: 'home'},
          { title: 'Nueva Receta', component: InputRecipe, icon: 'add-circle'},
          { title: 'Despensa', component: PantryPage, icon: 'md-cube'},
          { title: 'Congelador', component: FridgePage, icon: 'snow'},
          { title: 'Lista de compra', component: ShoppingListPage, icon: 'cart'},
          { title: 'Nuevo Ingrediente', component: NewIngredientPage, icon: 'add-circle'},
      ];
    }

      initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    openPage(page) {
        // close the menu when clicking a link from the menu
        this.menu.close();

        // navigate to the new page if it is not the current page
        if(page.component == HomePage){
            this.nav.setRoot(HomePage);
        } else {
            this.nav.push(page.component, {id: '0'});
        }
    }
}
