import {SafeResourceUrl} from "@angular/platform-browser";

export enum AppStatus {
  Up = 1,
  Down,
  Warning,
  Disabled
}

export class App {
  constructor(
    public name: string = "test name",
    public url: SafeResourceUrl = null,
    public status: AppStatus = AppStatus.Disabled,
    public imgUrl: string = "assets/imgs/scaleit-waben.png",
    public previewPosition: string = "left",
    public iconLocalHelper: string = "",
    public endPosition: {x:number, y: number} = {x: 0, y: 0}
) {}

  public previewing: boolean;

  updateMissingRemoteIcons() {
    if (this.imgUrl === "") {
      this.imgUrl = "assets/imgs/icons/" + this.iconLocalHelper + ".png";
    }
  }

  setBackground() {
    let result: string;
    switch (this.status) {
      case AppStatus.Up:
        result = "#32db64";
        break;
      case AppStatus.Down:
        // result = "map($color, danger)";
        result = "#f53d3d";
        break;
      case AppStatus.Warning:
        result = "#ffcc00";
        break;
      default:
        result = "gray";
        break;
    }
    return {
      "border-color": result,
      "background-image": 'url(' + this.imgUrl + ')',
      "background-repeat": 'no-repeat',
      "background-size": 'contain'
    }
  }


  previewToggle() {
    this.previewing = !this.previewing;
  }

  previewStyle() {
    let result = this.previewing ? "block" : "none";
    switch (this.previewPosition) {
      case "left":
        return {display: result, left: "7vw"};
      case "right":
        return {display: result, right: "7vw"};
      default:
        return {display: result};
    }
    // return { display: result, this.previewPosition: 7vw;};
  }

  onTopStyle() {
    let result = this.previewing ? 100 : 50;
    return {"z-index": result};
  }
}
