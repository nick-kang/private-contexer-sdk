import { ContexerDialogClass } from "@contexer/base";

export const helpCenter = new ContexerDialogClass({
  baseUrl: "http://localhost:4003",
  publicKey: "pk_abc123",
});

export function setupHelpCenter(element: HTMLButtonElement) {
  element.addEventListener("click", () => {
    console.log("Click");
    helpCenter.open();
  });
}
