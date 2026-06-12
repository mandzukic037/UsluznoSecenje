import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { OnamaComponent } from './onama-component/onama-component';
import { KontaktComponent } from './kontakt-component/kontakt-component';
import { UpitComponent } from './upit-component/upit-component';
import { SecenjeUslugaComponent } from './secenje-usluga-component/secenje-usluga-component';
import { CncSavijanjeComponent } from './cnc-savijanje-component/cnc-savijanje-component';
import { LaserskoGraviranjeComponent } from './lasersko-graviranje-component/lasersko-graviranje-component';
import { CadUslugaComponent } from './cad-usluga-component/cad-usluga-component';
import { TehnickaPodrskaComponent } from './tehnicka-podrska-component/tehnicka-podrska-component';
import { GalleryComponent } from './gallery-component/gallery-component';
import { ShopComponent } from './shop-component/shop-component';
import { CheckoutComponent } from './checkout-component/checkout-component';

export const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "onama", component: OnamaComponent},
    {path: "upit", component: UpitComponent},
    {path: "kontakt", component: KontaktComponent},
    {path: "secenje-usluga", component: SecenjeUslugaComponent},
    {path: "cnc-savijanje-usluga", component: CncSavijanjeComponent},
    {path: "lasersko-graviranje-usluga", component: LaserskoGraviranjeComponent},
    {path: "cad-dizajn-usluga", component: CadUslugaComponent},
    {path: "tehnicka-podrska-usluga", component: TehnickaPodrskaComponent},
    {path: "galerija", component: GalleryComponent},
    {path: "prodavnica", component: ShopComponent},
    {path: "korpa", component: CheckoutComponent }
];
