/**
 * Application version
 *
 * Exports the version for use in the application.
 * Automatically reads from package.json
 */
import packageJson from "../../package.json";

export const APP_VERSION = packageJson.version;
