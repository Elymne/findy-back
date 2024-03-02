import supertest from "supertest"
import app from "../src/server"

describe("Entry test.", () => {
    test("Working test launch.", async () => {
        expect(true).toBe(true)
    })
})

describe("Entry route", () => {
    test("App route /", async () => {
        const res = await supertest(app).get("/")
        expect(res.body).toEqual({ status: "API is running on /api" })
    })
})
