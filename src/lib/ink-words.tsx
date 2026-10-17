/* Server-safe helper for ScrollInk (a client module can't export callable helpers to the server). */

/** Splits text into `data-ink` word spans for ScrollInk, keeping normal spacing and wrapping. */
export function inkWords(text: string) {
  const words = text.split(" ");
  return words.map((word, index) => (
    <span key={`${word}-${index}`} data-ink>
      {word}
      {index < words.length - 1 && " "}
    </span>
  ));
}
