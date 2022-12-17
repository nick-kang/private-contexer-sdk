import EventEmitter from "eventemitter3";
import { ContexerDialogParams, ContexerMessage } from "./types";
import { logger } from "@contexter-test/logger";
import { ELEMENT_ID, MANIFEST_FILENAME } from "./constants";

export class ContexerDialogClass extends EventEmitter<
  ContexerMessage["messageType"]
> {
  constructor(private readonly params: ContexerDialogParams) {
    super();
    if (window == null) {
      logger.warn("Window is undefined.");
    }
    this.createElements().catch((e) => console.error(e));
  }

  private async createElements(): Promise<void> {
    const root = document.createElement("div");
    root.id = ELEMENT_ID;
    document.body.appendChild(root);

    const manifest: Record<string, any> = await fetch(
      new URL(MANIFEST_FILENAME, this.params.baseUrl)
    ).then((res) => res.json());

    const html = Object.values(manifest).find((m) => m.isEntry);

    if (html) {
      const scriptPath = html.file;
      const cssPaths = html.css;

      if (typeof scriptPath !== "string") {
        logger.error({ data: html }, "Expected script path to be a string");
        return;
      }

      if (!Array.isArray(cssPaths)) {
        logger.error({ data: html }, "Expected css paths to be an array");
        return;
      }

      const script = document.createElement("script");
      script.src = new URL(scriptPath, this.params.baseUrl).href;
      script.async = true;
      script.type = "module";
      script.onload = () => {
        this.postMessage({
          messageType: "init",
          data: {
            publicKey: this.params.publicKey,
          },
        });
      };
      document.head.appendChild(script);

      cssPaths.forEach((cssPath) => {
        if (typeof cssPath !== "string") {
          logger.error(
            { data: { html, cssPath } },
            "Expected css path to be a string"
          );
          return;
        }
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = new URL(cssPath, this.params.baseUrl).href;
        document.head.appendChild(link);
      });
    }
  }

  private postMessage(msg: ContexerMessage): void {
    window.postMessage(msg);
  }

  public open() {
    this.postMessage({ messageType: "open" });
    // this.iframe.style.visibility = "visible";
    // this.iframe.style.display = "block";
    // window.addEventListener("message", this.eventListener, false);
    // // window.document.removeEventListener("mouseup", this.close);
    // window.document.addEventListener("mouseup", () => {
    //   this.iframe.style.visibility = "hidden";
    //   this.iframe.style.display = "none";
    // });
  }

  // private eventListener(event: MessageEvent): void {
  //   if (event.source !== this.iframe?.contentWindow) {
  //     logger.debug(
  //       `Expected event source to equal ${this.iframe?.contentWindow}, but got ${event.source}`
  //     );
  //     return;
  //   }

  //   const message = event.data as ContexerMessage;

  //   switch (message.messageType) {
  //     case "open":
  //       this.emit("open");
  //       break;

  //     case "close":
  //       // this.emit("close");
  //       this.close();
  //       break;

  //     case "error":
  //       this.emit("error");
  //       break;

  //     default:
  //       logger.debug(`Invalid message: ${JSON.stringify(message)}`);
  //   }
  // }
}
