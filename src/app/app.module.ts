import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

// PAGES
import { HomePage } from '../pages/home/home';
import { RecipePage } from '../pages/recipe/recipe';
import { PantryPage } from '../pages/pantry/pantry';
import { InputRecipe } from '../pages/inputRecipe/inputRecipe';
import { EditionPage } from '../pages/edition/edition';
import { ShoppingListPage } from './../pages/shopping-list/shopping-list';
import { FridgePage } from './../pages/fridge/fridge';

// PROVIDERS
import { RecipesProvider } from '../providers/recipes/recipes';
import { ArraysService } from '../providers/arrays/arrays';
import { ShoppingListService } from '../providers/ingredients/shoppingListService';

// PIPES
import { PipesModule } from './../pipes/pipes.module';

// PLUGINS
import { Camera } from '@ionic-native/camera';
import { FileTransfer} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

@NgModule({
  declarations: [
    MyApp,
    HomePage,  
    RecipePage,
    PantryPage,
    InputRecipe,
    EditionPage,
    ShoppingListPage,
    FridgePage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    PipesModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RecipePage,
    PantryPage,
    InputRecipe,
    EditionPage,
    ShoppingListPage,
    FridgePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RecipesProvider,
    ArraysService,
    ShoppingListService,
    Camera,
    File,
    FilePath,
    FileTransfer
  ]
})
export class AppModule {}
