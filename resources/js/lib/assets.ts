// B219: the design system's logos, icons and photos by name, which the design-system export of Route14 puts in
// public/images/design. The same asset() as Route14's prototype kit has.
export function asset(name: string): string {
    return `/images/design/${encodeURIComponent(name)}`;
}
