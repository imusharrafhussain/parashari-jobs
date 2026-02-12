console.log("🔥🔥🔥 DEBUG ENTRY: Node process started! 🔥🔥🔥");
console.log("Current Directory:", process.cwd());
console.log("Environment PORT:", process.env.PORT);

async function bootstrap() {
    try {
        console.log("DEBUG ENTRY: Importing server.js...");
        await import('./server.js');
        console.log("DEBUG ENTRY: server.js imported successfully.");
    } catch (err) {
        console.error("❌ DEBUG ENTRY: Failed to import server.js:", err);
        process.exit(1);
    }
}

bootstrap();
