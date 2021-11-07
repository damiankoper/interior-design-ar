import { Service } from "typedi";
import { Ref } from "vue";
import { ServiceLifecycle } from "../interfaces/ServiceLifecycle.interface";

@Service()
export class OverlayXRService implements ServiceLifecycle {
  private overlay: HTMLDivElement | null = null;
  private toastMessage?: Ref<string>;
  private readonly err = new Error("Overlay not initiated!");

  get root(): HTMLDivElement {
    if (!this.overlay) throw this.err;
    return this.overlay;
  }

  public async init(toastMessage: Ref<string>): Promise<void> {
    this.toastMessage = toastMessage;
    const overlay = document.querySelector("#overlay") as HTMLDivElement;
    if (!overlay) {
      this.overlay = document.createElement("div");
      document.body.appendChild(this.overlay);
    } else {
      this.overlay = overlay;
    }
  }

  public show() {
    if (!this.overlay) throw this.err;
    this.overlay.style.display = "flex";
  }

  public hide() {
    if (!this.overlay) throw this.err;
    this.overlay.style.display = "none";
    this.showToast("");
  }

  public showToast(message: string) {
    if (!this.toastMessage) throw new Error("Toast ref not initiated!");
    this.toastMessage.value = message;
  }

  public async destroy(): Promise<void> {
    this.hide();
    this.overlay = null;
  }
}
