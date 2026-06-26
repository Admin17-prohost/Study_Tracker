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
const sourceInput = document.getElementById("source")
const notesEl = document.getElementById("notes")

dateEl.value =
new Date()
.toISOString()
.split("T")[0]

function calculateXP(){

let xp=0

study.forEach(item=>{

let gain=
(item.hours+(item.minutes/60))*10

if(item.topic==="React")
gain+=5

xp+=Math.round(gain)

})

return xp

}

function getLevel(xp){

if(xp>=500)
return "Pro 👑"

if(xp>=250)
return "Intermediate 🔥"

if(xp>=100)
return "Learner 🚀"

return "Beginner 🌱"

}

function changeHour(v){

let h=
Number(hoursEl.value)

h+=v

if(h<0)h=0

if(h>12)h=12

hoursEl.value=h

}

function changeMin(v){

let m=
Number(minutesEl.value)

m+=v

if(m<0)m=0

if(m>45)m=45

minutesEl.value=m

}

function saveStudy(){

let h=
Number(hoursEl.value)

let m=
Number(minutesEl.value)

if(h===0&&m===0){

alert("Add study time")

return

}

study.push({

date:
dateEl.value,

topic:
topicEl.value,

hours:h,

minutes:m,

source:
sourceInput.value,

notes:
notesEl.value

})

localStorage.setItem(
"study",
JSON.stringify(study)
)

hoursEl.value=1
minutesEl.value=0

sourceInput.value=""
notesEl.value=""

render()

}

function deleteStudy(index){

study.splice(index,1)

localStorage.setItem(
"study",
JSON.stringify(study)
)

render()

}

function getBadges(){

let total=0

study.forEach(x=>{

total+=
x.hours+
(
x.minutes/60
)

})

let list=[]

if(total>=1)
list.push("🟡 Starter")

if(total>=10)
list.push("⚡ Warrior")

if(total>=25)
list.push("🔥 Master")

if(total>=50)
list.push("👑 Legend")

return list

}

function setView(type){

currentView=type

localStorage.setItem(
"view",
type
)

render()

}

function render(){

let xp=
calculateXP()

xpEl.textContent=
xp

levelEl.textContent=
getLevel(xp)

barEl.style.width=
Math.min(
(xp/500)*100,
100
)+"%"

badgesEl.innerHTML=

getBadges()

.map(
b=>

`<span class="badge">

${b}

</span>`

)

.join("")

historyEl.innerHTML=""

let list=
[...study]
.reverse()

if(
currentView==="card"
){

list.forEach(
(item,i)=>{

historyEl.innerHTML+=`

<div class="card">

<div>

📅
${item.date}

</div>

<div>

${item.topic}

</div>

<div>

⏰
${item.hours}
hr

${item.minutes}
min

</div>

${
item.source

?

`

<a
href="${item.source}"
target="_blank"
class="source">

🔗 Open Source

</a>

`

:

""

}

<div>

${item.notes}

</div>

<button

onclick=

"deleteStudy(

${study.length-1-i}

)"

class="delete">

🗑 Delete

</button>

</div>

`

})

}

else{

historyEl.innerHTML=`

<table class="table">

<tr>

<th>
Date
</th>

<th>
Topic
</th>

<th>
Time
</th>

<th>
Source
</th>

<th>
Notes
</th>

<th>
Action
</th>

</tr>

${

list

.map(
(item,i)=>`

<tr>

<td>

${item.date}

</td>

<td>

${item.topic}

</td>

<td>

${item.hours}h

${item.minutes}m

</td>

<td>

${
item.source

?

`

<a
href="${item.source}"
target="_blank">

🔗 Open

</a>

`

:

"-"

}

</td>

<td>

${item.notes}

</td>

<td>

<button

onclick=

"deleteStudy(

${study.length-1-i}

)"

class="delete">

🗑

</button>

</td>

</tr>

`

)

.join("")

}

</table>

`

}

}

render()
