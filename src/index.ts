import buildContainer from "./domain/di/BuilderContainer";
import app from "./server";

console.log("MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE ");

buildContainer();

const port = process.env.PORT ?? "3000";
app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`);
});
