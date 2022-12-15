import "./style.css";
import { setupHelpCenter } from "./actions";

setupHelpCenter(document.querySelector<HTMLButtonElement>("#help")!);
