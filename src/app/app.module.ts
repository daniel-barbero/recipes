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
import { EditionIngredients } from '../pages/edition/editionIngredients';
import { EditionAdvices } from '../pages/edition/editionAdvices';
import { ShoppingListPage } from '../pages/shopping-list/shopping-list';
import { FridgePage } from '../pages/fridge/fridge';
import { NewIngredientPage } from '../pages/new-ingredient/new-ingredient';

// PROVIDERS
import { RecipesProvider } from '../providers/recipes/recipes';
import { ArraysService } from '../providers/arrays/arrays';
import { ListIngredientService } from '../providers/ingredients/listIngredientService';

// PIPES
import { PipesModule } from '../pipes/pipes.module';

// PLUGINS
import { Camera } from '@ionic-native/camera';
import { FileTransfer} from '@ionic-native/file-transfer';
import { ImageResizer } from '@ionic-native/image-resizer';
import { File } from '@ionic-native/file';

@NgModule({
  declarations: [
    MyApp,
    HomePage,  
    RecipePage,
    PantryPage,
    InputRecipe,
    EditionIngredients,
    EditionAdvices,
    ShoppingListPage,
    FridgePage,
    NewIngredientPage
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
    EditionIngredients,
    EditionAdvices,
    ShoppingListPage,
    FridgePage,
    NewIngredientPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RecipesProvider,
    ArraysService,
    ListIngredientService,
    Camera,
    File,
    FileTransfer,
    ImageResizer
  ]
})
export class AppModule {}
