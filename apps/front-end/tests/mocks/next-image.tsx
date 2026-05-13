/**
 * Mock for next/image (used by Vitest alias).
 * Renders a plain img to avoid Next.js Image handling in tests.
 */
import type { ReactElement } from "react";
import { createElement } from "react";

type ImageProps = Record<string, unknown> & { alt?: string };

function MockImage(props: ImageProps): ReactElement {
  return createElement("img", { ...props, alt: props.alt ?? "" });
}

export default MockImage;
