use("findy_alternance")

db.createCollection("text_filter", {
    id: String,
    value: String,
})

db.createCollection("job_offer_history", {
    id: String,
    source: String,
    sourceSite: String,
    isBanned: Boolean,
})
