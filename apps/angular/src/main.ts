import { bootstrapApplication } from '@angular/platform-browser'
import 'aos/dist/aos.css'
import { AppComponent } from './app/app.component'

bootstrapApplication(AppComponent).catch((error) => console.error(error))
