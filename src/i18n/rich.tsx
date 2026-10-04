import { Fragment, type ReactNode } from "react";

// Renders a translated string, swapping {placeholders} for React nodes:
// rich("Hi {name}!", { name: <b>Ana</b> })
export function rich(template: string, nodes: Record<string, ReactNode>) {
  return template.split(/(\{\w+\})/g).map((part, i) => {
    const match = part.match(/^\{(\w+)\}$/);
    return (
      <Fragment key={i}>{match && match[1] in nodes ? nodes[match[1]] : part}</Fragment>
    );
  });
}
