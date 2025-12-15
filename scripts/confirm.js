const readline = require('readline');

const args = process.argv.slice(2);
const message = args[0] || "Are you sure you want to proceed? (y/n)";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question(`\n⚠️  ${message} [y/N]: `, (answer) => {
    rl.close();
    if (answer.trim().toLowerCase() === 'y' || answer.trim() === '1') {
        process.exit(0);
    } else {
        console.log("❌ Operation cancelled.");
        process.exit(1);
    }
});
