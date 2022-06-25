import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ErrorInterceptor } from "./error.interceptor";
import { MaterialModule } from "../material.module";
import { ErrorComponent } from "./error.component";

@NgModule({
    declarations: [ ErrorComponent ],
    imports: [ MaterialModule ],
    providers: [ 
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ]
})
export class ErrorModule { }