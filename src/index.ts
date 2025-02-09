import app from "./server";

const port = process.env.PORT ?? "3000";
app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`);
});
