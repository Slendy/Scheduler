import { connectToDb, generateDefaultEnvironment, generateDefaultUser } from '$lib/server/db';

try {
    console.log("Connecting to database...")
    await connectToDb();
    await generateDefaultUser();
    await generateDefaultEnvironment();
    console.log("Connected to database");
} catch (error) {
    console.log("Failed to connect to database:")
    console.log(error);
    process.exit();
}
