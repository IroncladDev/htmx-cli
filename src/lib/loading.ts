import chalk from "chalk";

export const loaders = {
  laserHorse: [
    "      ▰🐴",
    "     ▰▰🐴",
    "    ▰▰▰🐴",
    "   ▰▰▰▰🐴",
    "  ▰▰▰▰▰🐴",
    " ▰▰▰▰▰▰🐴",
    "▰▰▰▰▰▰▰🐴",
    "▰▰▰▰▰▰ 🐴",
    "▰▰▰▰▰  🐴",
    "▰▰▰▰   🐴",
    "▰▰▰    🐴",
    "▰▰     🐴",
    "▰      🐴",
    "       🐴",
  ],
};

export function withLoading<T>(
  promise: Promise<T>,
  callback: (tick: number) => void,
  interval: number,
): Promise<T> {
  let tick = 0;
  const intervalId = setInterval(() => {
    tick++;
    callback(tick);
  }, interval);

  return new Promise((resolve, reject) => {
    promise
      .then((value) => {
        clearInterval(intervalId);
        resolve(value);
      })
      .catch((error) => {
        clearInterval(intervalId);
        reject(error);
      });
  });
}

export function withLoadingLaserhorse<T>(
  promise: Promise<T>,
  message: string,
): Promise<T> {
  return withLoading(
    promise,
    (tick) => {
      process.stdout.write(
        `\r${chalk.red(
          loaders.laserHorse[tick % loaders.laserHorse.length],
        )} ${message}`,
      );
    },
    80,
  );
}
