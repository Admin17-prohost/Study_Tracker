let study =
JSON.parse(localStorage.getItem("study")) || []

let currentView =
localStorage.getItem("view") || "card"

const xpEl = document.getElementById("xp")
const levelEl = document.getElementById("level")
const barEl = document.getElementById("bar")
const historyEl = document.getElementById("history")
const badgesEl = document.getElementById("badges")

const dateEl = document.getElementById("date")
const topicEl = document.getElementById("topic")
const hoursEl = document.getElementById("hours")
const minutesEl = document.getElementById("minutes")
const notesEl = document.getElementById("notes")

dateEl.value = new Date().toISOString().split("T")[0]

/* ---------------- XP ---------------- */

function calculateXP() {
let xp = 0

study.forEach(item => {
let gain =
(item.hours + item.minutes / 60) * 10

if (item.topic === "React") gain += 5

xp += Math.round(gain)
})

return xp
}

/* ---------------- LEVEL ---------------- */

function getLevel(xp) {
if (xp >= 500) return "Pro 👑"
if (xp >= 250) return "Intermediate 🔥"
if (xp >= 100) return "Learner 🚀"
return "Beginner 🌱"
}

/* ---------------- COUNTERS ---------------- */

function changeHour(v) {
let h = Number(hoursEl.value)
h += v
if (h < 0) h = 0
if (h > 12) h = 12
hoursEl.value = h
}

function changeMin(v) {
let m = Number(minutesEl.value)
m += v
if (m < 0) m = 0
if (m > 45) m = 45
minutesEl.value = m
}

/* ---------------- SAVE ---------------- */

function saveStudy() {
let h = Number(hoursEl.value)
let m = Number(minutesEl.value)

if (h === 0 && m === 0) {
alert("Add study time da 😏")
return
}

study.push({
date: dateEl.value,
topic: topicEl.value,
hours: h,
minutes: m,
notes: notesEl.value
})

localStorage.setItem("study", JSON.stringify(study))

hoursEl.value = 1
minutesEl.value = 0
notesEl.value = ""

render()
}

/* ---------------- DELETE ---------------- */

function deleteStudy(index) {
study.splice(index, 1)
localStorage.setItem("study", JSON.stringify(study))
render()
}

/* ---------------- BADGES ---------------- */

function getBadges() {
let total = 0

study.forEach(x => {
total += x.hours + x.minutes / 60
})

let list = []

if (total >= 1) list.push("🟡 Starter")
if (total >= 10) list.push("⚡ Warrior")
if (total >= 25) list.push("🔥 Master")
if (total >= 50) list.push("👑 Legend")

return list
}

/* ---------------- VIEW ---------------- */

function setView(type) {
currentView = type
localStorage.setItem("view", type)
render()
}

/* ---------------- RENDER ---------------- */

function render() {
let xp = calculateXP()

xpEl.textContent = xp
levelEl.textContent = getLevel(xp)

barEl.style.width =
Math.min((xp / 500) * 100, 100) + "%"

/* badges */
badgesEl.innerHTML =
getBadges()
.map(b => `<span class="badge">${b}</span>`)
.join("")

/* history */
historyEl.innerHTML = ""

let list = [...study].reverse()

if (currentView === "card") {

list.forEach((item, i) => {
historyEl.innerHTML += `
<div class="card">
<div class="meta">
📅 ${item.date}
</div>

<div class="title">
${item.topic}
</div>

<div class="time">
⏰ ${item.hours} hr ${item.minutes} min
</div>

<div class="note">
${item.notes}
</div>

<button onclick="deleteStudy(${study.length - 1 - i})" class="delete">
<i class="fa-regular fa-trash-can"></i> Delete
</button>

</div>
`
})

} else {

historyEl.innerHTML = `
<table class="table">
<tr>
<th>Date</th>
<th>Topic</th>
<th>Time</th>
<th>Notes</th>
<th>Action</th>
</tr>

${list.map((item, i) => `
<tr>
<td>${item.date}</td>
<td>${item.topic}</td>
<td>${item.hours}h ${item.minutes}m</td>
<td>${item.notes}</td>
<td>
<button onclick="deleteStudy(${study.length - 1 - i})" class="delete">
<i class="fa-regular fa-trash-can"></i>
</button>
</td>
</tr>
`).join("")}

</table>
`
}
}

/* INIT */
render()