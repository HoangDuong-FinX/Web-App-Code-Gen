import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import App from "./App";

// Deliberately says nothing about the content: generated screens replace
// App.tsx, and a test asserting on scaffold text would fail the moment real
// code lands. What it does prove is that the app *mounts* - the class of bug a
// type-check cannot see, because `tsc` is happy with `(x as Cfg).theme.name`
// right up until `theme` is undefined at runtime. Add real assertions per
// screen on top of this; do not delete it to make a red run go green.
test("App mounts and renders something", () => {
  const { container } = render(<App />);
  expect(container.firstChild).not.toBeNull();
});
