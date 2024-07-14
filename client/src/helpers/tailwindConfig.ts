import tailwindConfig from "../../tailwind.config.js";
import resolveConfig from "tailwindcss/resolveConfig";
import { Config } from "tailwindcss/types/config.js";

const unresolvedConfig = tailwindConfig as Config;
const config = resolveConfig(unresolvedConfig);

export default config;
