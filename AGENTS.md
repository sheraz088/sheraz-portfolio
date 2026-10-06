<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep this portfolio as a static single-page TanStack route with anchor navigation; the supplied content does not need a backend.
- Define all portfolio visual styling and theme roles in src/styles.css and use the shared Button for controls to maintain consistent appearance.
- Lazy-load the decorative React Three Fiber scene behind ClientOnly so the portfolio stays server-rendered; derive materials from CSS tokens and respect reduced motion.
