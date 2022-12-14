import EventEmitter from "eventemitter3";
import { ContexerDialogParams, ContexerMessage } from "./types";
import { logger } from "@contexer/logger";

const IFRAME_ID = "_contexer-iframe";

export class ContexerDialogClass extends EventEmitter<
  ContexerMessage["messageType"]
> {
  public iframe: HTMLIFrameElement;

  constructor(private readonly params: ContexerDialogParams) {
    super();
    if (window == null) {
      logger.warn("Window is undefined.");
    }

    const maybeIframe = document.getElementById(IFRAME_ID);

    if (maybeIframe instanceof HTMLIFrameElement) {
      logger.debug("iframe already created.");
      this.iframe = maybeIframe;
      return;
    } else {
      logger.debug("iframe not found. Creating one.");

      const iframe = document.createElement("iframe");
      iframe.id = IFRAME_ID;

      this.iframe = iframe;
      this.iframe.setAttribute("allowtransparency", "true");

      // Add base styles
      this.iframe.style.visibility = "hidden";
      this.iframe.style.position = "absolute";
      this.iframe.style.right = "10px";
      this.iframe.style.top = "10px";
      this.iframe.style.border = "none";
      this.iframe.style.height = "100%";

      const url = new URL(this.params.baseUrl);
      url.searchParams.set("public_key", this.params.publicKey);

      this.iframe.src = url.href;
    }

    this.createElements().catch((e) => console.error(e));
  }

  private async createElements(): Promise<void> {
    const root = document.createElement("div");
    root.id = "contexer-root";
    document.body.appendChild(root);

    const manifest: Record<string, any> = await fetch(
      new URL("manifest.json", this.params.baseUrl)
    ).then((res) => res.json());

    const html = Object.values(manifest).find((m) => m.isEntry);

    if (html) {
      const scriptPath = html.file as string;
      const cssPaths = html.css as string[];

      const script = document.createElement("script");
      script.src = new URL(scriptPath, this.params.baseUrl).href;
      script.async = true;
      script.type = "module";
      script.onload = () => {
        window.postMessage({ messageType: "open" });
      };
      document.head.appendChild(script);

      cssPaths.forEach((cssPath) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = new URL(cssPath, this.params.baseUrl).href;
        document.head.appendChild(link);
      });
    }
  }

  public open() {
    this.iframe.style.visibility = "visible";
    this.iframe.style.display = "block";
    window.addEventListener("message", this.eventListener, false);
    // window.document.removeEventListener("mouseup", this.close);
    window.document.addEventListener("mouseup", () => {
      this.iframe.style.visibility = "hidden";
      this.iframe.style.display = "none";
    });
  }

  private hide(): void {
    this.iframe.style.visibility = "hidden";
    this.iframe.style.display = "none";
  }

  get isOpen(): boolean {
    return this.iframe.style.visibility === "visible";
  }

  private eventListener(event: MessageEvent): void {
    if (event.source !== this.iframe?.contentWindow) {
      logger.debug(
        `Expected event source to equal ${this.iframe?.contentWindow}, but got ${event.source}`
      );
      return;
    }

    const message = event.data as ContexerMessage;

    switch (message.messageType) {
      case "open":
        this.emit("open");
        break;

      case "close":
        // this.emit("close");
        this.close();
        break;

      case "error":
        this.emit("error");
        break;

      default:
        logger.debug(`Invalid message: ${JSON.stringify(message)}`);
    }
  }
}
