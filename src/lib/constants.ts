import chalk from "chalk";
import { z } from "zod";

export const packagers = ["bun", "npm", "yarn", "pnpm"] as const;
export const packager = z.enum(packagers);
export type Packager = z.infer<typeof packager>;

export const frameworks = ["elysia", "express"] as const;
export const framework = z.enum(frameworks);
export type Framework = z.infer<typeof framework>;

/**
 * The message to display when an htmx project is successfully created.
 */
export const successfulInstallMessage = ({
  path,
  isStatic,
  tailwind,
  packager,
}: {
  path: string;
  isStatic: boolean;
  tailwind: boolean;
  packager?: Packager;
}) => {
  return `\n${chalk.white.bold(`Created ${chalk.red(
    "htmx",
  )} project successfully

To get started, run:

  ${chalk.blue(`cd ${path}`)}
  ${
    !isStatic && packager
      ? chalk.blue(`${packager} run dev`)
      : tailwind
        ? chalk.blue(`${packager} run watch`)
        : ""
  }`)}\n`;
};

/**
 * The default README.md content for an htmx project based on the options passed in.
 */
export const readmeContent = ({
  framework,
  packager,
  hyperscript,
  tailwind,
}: {
  framework?: Framework;
  packager?: Packager;
  hyperscript: boolean;
  tailwind: boolean;
  isStatic: boolean;
}) => {
  const contents = [
    `# HTMX App

This is an [HTMX](https://htmx.org) app bootstrapped with [\`htmx-cli\`](https://www.npmjs.com/package/htmx-cli)${
      tailwind ? " and [Tailwind CSS](https://tailwindcss.com)" : ""
    }.

## Getting Started`,
  ];

  if (framework) {
    contents.push(`First, run the development server:

\`\`\`bash
${packager} run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying the files in the \`public\` folder, which is served statically.`);
  } else if (tailwind) {
    contents.push(`First, run the tailwind watcher:

\`\`\`bash
${packager} run watch
\`\`\`

The files in the project directory will be served statically.`);
  }

  contents.push(`## Learn More

To learn more about htmx${
    hyperscript ? " and hyperscript" : ""
  }, take a look at the following resources:

- [htmx Documentation](https://htmx.org)
${
  hyperscript ? "- [Hyperscript Documentation](https://hyperscript.org)" : ""
}}`);

  return contents.join("\n\n");
};
