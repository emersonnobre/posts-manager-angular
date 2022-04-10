import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

@Component({
    templateUrl: "./error.component.html",
})
export class ErrorComponent {
    message = "An unknow error ocurred";
}