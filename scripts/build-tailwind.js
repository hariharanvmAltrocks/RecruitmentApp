const { execSync } = require("child_process");
const path = require("path");

const input = path.join(__dirname, "../src/webparts/recrutimentApp/External/tailwind.src.css");
const output = path.join(__dirname, "../src/webparts/recruitmentApp/External/tailwind.css");

console.log("Compiling Tailwind CSS...");

try {
  execSync(`npx tailwindcss -i "${input}" -o "${output}" --postcss`, {
    stdio: "inherit"
  });

  console.log("Tailwind CSS compiled successfully.");
} catch (error) {
  console.error("Tailwind build failed:", error);
  process.exit(1);
}