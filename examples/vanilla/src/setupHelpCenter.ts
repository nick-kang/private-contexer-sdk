import { ContexerDialogClass } from "@contexer/base";

export function setupHelpCenter(element: HTMLButtonElement) {
  const helpCenter = new ContexerDialogClass({
    baseUrl: "http://localhost:3002",
    clientId: "pk_abc123",
  });

  element.addEventListener("click", () => {
    helpCenter.open();
  });
}
