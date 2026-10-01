// TODO(owner): supply verified destinations. Unknown contacts are plain text,
// never guessed addresses, empty links or disabled controls.
export const contactLinks: readonly { label: string; href: `https://${string}` | `mailto:${string}` | null }[] = [
  { label: "Email", href: null },
  { label: "LinkedIn", href: null },
  { label: "GitHub", href: null },
  { label: "Instagram", href: null },
];
