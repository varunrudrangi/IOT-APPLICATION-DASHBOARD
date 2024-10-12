import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';  // Import AppModule

platformBrowserDynamic().bootstrapModule(AppModule)  // Bootstraps AppModule
  .catch(err => console.error(err));
