import { JSXElementConstructor } from "react";
import { JsxElement } from "typescript";

export type Props = {
    message: string;
    children?: JSX.Element;
    onClose?: VoidFunction;
}
