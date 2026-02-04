export const transformCodeForBrowser = (code: string, stdin: string) => {
    let transformed = code;

    // import fs を除去
    transformed = transformed.replace(/import .*fs.*\n/g, "");
    transformed = transformed.replace(/const fs = require\(.*\);\n/g, "");

    // fs.readFileSync を input 変数に置換
    transformed = transformed.replace(
        /fs\.readFileSync\(0,\s*["']utf8["']\)/g,
        `"${stdin}"`,
    );

    return transformed;
};
