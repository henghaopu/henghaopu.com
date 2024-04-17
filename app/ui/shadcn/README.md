# shadcn/ui

### [Configuration](https://ui.shadcn.com/docs/cli) in this project

```
npx shadcn-ui@latest init
```

- ✔ Would you like to use TypeScript (recommended)? › yes
- ✔ Which style would you like to use? › New York
- ✔ Which color would you like to use as base color? › Slate
- ✔ Where is your global CSS file? › app/styles/shadcn.css
- ✔ Would you like to use CSS variables for colors? › yes
- ✔ Are you using a custom tailwind prefix eg. tw-? › (Leave blank)
- ✔ Where is your tailwind.config.js located? › tailwind.config.ts
- ✔ Configure the import alias for components: › ~/ui/shadcn
- ✔ Configure the import alias for utils: › ~/ui/shadcn/utils
- ✔ Are you using React Server Components? › no
- ✔ Write configuration to components.json. Proceed? › yes

### Get the UI component source code

All the UI components in this directory can be copied and pasted from the
[shadcn/ui doc](https://ui.shadcn.com/docs) or through
[CLI](https://ui.shadcn.com/docs/cli).

For example, to add the shadcn Button component:

```
npx shadcn-ui@latest add button --path app/ui/shadcn
```

### Some useful git command

#### Discard/remove untracked files and folders

-f: force the removal of untracked files and folders; -d: remove untracked
directories

```
git clean -fd // git clean -f -d
```

#### Forcefully discard modifications made to the existing files

```
git reset --hard
```
