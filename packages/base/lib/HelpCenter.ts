import EventEmitter from "eventemitter3";
import Debug from "debug";
import { ContexerDialogParams, ContexerMessage } from "./types";

const debug = Debug("contexer");

export class ContexerDialogClass extends EventEmitter<
  ContexerMessage["messageType"]
> {
  public iframe?: HTMLIFrameElement;
  private baseUrl: string;
  private clientId: string;
  private devMode = false;
  private isLoaded = false;
  private client = "Dialog";

  constructor(params: ContexerDialogParams) {
    super();
    this.baseUrl = params.baseUrl;
    this.clientId = params.clientId;

    if (window == null) {
      debug("Unable to initialize because window is undefined");
      return;
    }

    const iframeId = "_contexer-iframe";
    this.iframe = document.getElementById(iframeId) as HTMLIFrameElement;

    if (this.iframe) {
      const count = parseInt(this.iframe.dataset.count || "0", 10);

      if (isNaN(count)) {
        debug(
          `Invalid value in this.iframe.dataset.count. Expected number but got ${this.iframe.dataset.count}`
        );
      }

      const nextCount = isNaN(count) ? String(count + 1) : "1";
      this.iframe.dataset.count = nextCount;
    } else {
      const iframe = document.createElement("iframe");
      iframe.id = iframeId;
      iframe.dataset.count = "1";
      this.setIframe(iframe);
    }

    const parent = document.body 
    console.log('hit')
    parent.append(this.iframe)
  }

  private setIframe(iframe: HTMLIFrameElement): void {
    if (this.iframe) {
      debug("iframe is already set");
      // TODO: this.close(true)
    }

    this.iframe = iframe;
    this.iframe.setAttribute("allowtransparency", "true");

    const url = new URL(this.baseUrl);

    url.searchParams.set("embed_client_id", this.clientId);
    url.searchParams.set("dev_mode", String(this.devMode));

    this.iframe.src = url.href;
    this.isLoaded = false;
    this.iframe.onload = () => {
      this.isLoaded = true;
    };

    // TODO: this.hide()
  }

  /**
   * open
   */
  public open() {
    this.launch();
  }

  private launch() {
    window.addEventListener("message", this.eventListener);
  }

  private eventListener(event: MessageEvent): void {
    if (event.source !== this.iframe?.contentWindow) {
      debug(
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
        this.emit("close");
        break;

      case "error":
        this.emit("error");
        break;

      default:
        debug(`Invalid message: ${JSON.stringify(message)}`);
    }
  }
}
