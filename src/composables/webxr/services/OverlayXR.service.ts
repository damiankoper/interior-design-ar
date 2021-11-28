import { Service } from "typedi";
import { ServiceLifecycle } from "../interfaces/ServiceLifecycle.interface";
import { Toast } from "../interfaces/Toast.interface";

@Service()
export class OverlayXRService implements ServiceLifecycle {
  private overlay: HTMLDivElement | null = null;
  private readonly err = new Error("Overlay not initiated!");

  private toast?: Toast;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  get root(): HTMLDivElement {
    if (!this.overlay) throw this.err;
    return this.overlay;
  }

  public async init(toast: Toast): Promise<void> {
    this.toast = toast;
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

  public showToast(message: string, timeout = 5000) {
    if (!this.toast) throw new Error("Toast ref not initiated!");
    this.toast.message = message;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast.visible = true;
    this.toastTimer = setTimeout(() => {
      if (this.toast) this.toast.visible = false;
    }, timeout);
  }

  public async destroy(): Promise<void> {
    this.hide();
    this.overlay = null;
  }
}
