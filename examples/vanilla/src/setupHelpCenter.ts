import { ContexerDialogClass } from "@contexer/base";

export function setupHelpCenter(element: HTMLButtonElement) {
  const helpCenter = new ContexerDialogClass({
    baseUrl: "http://localhost:4003",
    publicKey: "pk_abc123",
  });

  element.addEventListener("click", () => {
    console.log("Click");
    helpCenter.open();
  });
}
