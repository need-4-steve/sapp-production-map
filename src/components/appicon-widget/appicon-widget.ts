import {
  Component
} from "@angular/core";
import {App} from "./app";
import {DomSanitizer} from "@angular/platform-browser";
import {SharedLocalStorageProvider} from "../../providers/localstorageservice/sharedlocalstorage";

/**
 * Generated class for the AppiconWidgetComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "appicon-widget",
  templateUrl: "appicon-widget.html"
})
export class AppiconWidgetComponent {

  chosenApps: Array<App>;
  public smokescreen: boolean = false;

  ifMoved: Array<boolean>;
  start = {x: 0, y: 0};
  end = {x: 0, y: 0};

  constructor(public sanitizer: DomSanitizer,
              private sharedLocalStorageProvider: SharedLocalStorageProvider) {
    console.log("Initializing App Icons...");
    this.smokescreen = false;
    this.chosenApps = this.sharedLocalStorageProvider.getChosenApps();
    this.sharedLocalStorageProvider.getChosenAppsControl().subscribe(newChosenApps => {
      this.chosenApps = newChosenApps;
      this.ifMoved = new Array(this.chosenApps.length);
      for (let i = 0; i < this.chosenApps.length; i++) {
        this.ifMoved[i] = false;
      }

    });

    /*
        this.chosenApps.push(
          new App(
            "Ionic App",
            "https://codecraft.tv",

            AppStatus.Up,
            "/assets/imgs/vis-app.png"
          )
        );

        this.apps.push(
          new App(
            "AOI Machine",
            "https://codecraft.tv",

            AppStatus.Up,
            "/assets/imgs/machine-app.png",
            "right"
          )
        );
        this.apps.push(
          new App("test-app", "localhost:3000/", AppStatus.Down)
        );
        this.apps.push(
          new App("test-app2", "localhost:3000/", AppStatus.Warning)
        );
        this.apps.push(new App("test-app3", "localhost:8100"));
        */

  }

  ngAfterViewInit() {

  }

  public log(text: string) {
    console.log(text);
  }

  public hideMe(event) {
    this.log("called hideMe");
    let result = false;
    this.chosenApps.forEach(app => {
      if (app.previewing == true) result = true;
    });
    this.smokescreen = result;

    var target = event.target || event.srcElement;
    if (this.smokescreen) {
      target.style.visibility = "visible";
    } else {
      target.style.visibility = "hidden";
    }
  }

  public previewHandler(app: App) {
    var index = this.chosenApps.indexOf(app);

    if (!this.ifMoved[index]) {
      document.getElementById("smoke-screen").style.visibility = "visible";
      app.previewToggle();
    }

  }

  delete(index: number) {
    this.sharedLocalStorageProvider.delChosenAppsByIndex(index);
  }

  //save endPosition, by transforming array of positions into a string and saving it in localStorage
  saveStyle(index) {
    //this.itemEndPosition[index] = {x: this.end.x, y: this.end.y};
    this.chosenApps[index].endPosition = {x: this.end.x, y: this.end.y};
    this.sharedLocalStorageProvider.getChosenAppsControl().next(this.chosenApps);
    //this.positionString = JSON.stringify(this.itemEndPosition);
  }


  onStop(event, index) {
    var transformArray = this.parseTransformString(event.style.transform);
    this.end.x = transformArray[0];
    this.end.y = transformArray[1];

    this.saveStyle(index);
    this.chechIfMoved(index);

  }

  onStart(event) {
    var transformArray = this.parseTransformString(event.style.transform);
    this.start.x = transformArray[0];
    this.start.y = transformArray[1];


  }

  chechIfMoved(index) {
    if (this.start.x != this.end.x || this.start.y != this.end.y) {
      console.log(this.start.x != this.end.x && this.start.y != this.end.y);
      this.ifMoved[index] = true;
    } else {
      this.ifMoved[index] = false;
    }
    console.log(this.ifMoved);
  }

  parseTransformString(input: string): Array<number> {
    var regex = /-?\d/g;
    var stringArray = input.split(",");
    for (let i = 0; i < 2; i++) {
      stringArray[i] = stringArray[i].match(regex).join("");
    }
    return stringArray.map(Number);
  }

  undo(index: number) {
    this.end.x = 0;
    this.end.y = 0;
    this.saveStyle(index);
    this.chosenApps[index].previewToggle();
    // this.chechIfMoved(index);
  }

}
