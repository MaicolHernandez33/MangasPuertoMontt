// karma.conf.js (ESM)
export default function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],

    files: [
      { pattern: "src/tests/**/*.test.@(js|jsx)", watched: false }
    ],

    preprocessors: {
      "src/tests/**/*.test.@(js|jsx)": ["esbuild"]
    },

    esbuild: {
      target: "es2019",
      format: "iife",
      jsx: "transform",
      sourcemap: "inline"
    },

    reporters: ["progress", "kjhtml"],
    browsers: ["ChromeHeadless"], 
    singleRun: true,
    autoWatch: false,
    colors: true,
    logLevel: config.LOG_INFO,
    client: { clearContext: false }
  });
}
