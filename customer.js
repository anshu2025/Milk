let records=JSON.parse(localStorage.getItem("custRecords"))||[]

// 👇 YE ADD KARO
function getText(en, hi){
    let lang = localStorage.getItem("lang") || "en";
    return lang === "hi" ? hi : en;
}
function save(){

localStorage.setItem("custRecords",JSON.stringify(records))

}
function getText(en, hi){
    let lang = localStorage.getItem("lang") || "en";
    return lang === "hi" ? hi : en;
}

function addRecord(){

let milkman = localStorage.getItem("milkmanName");
let date = document.getElementById("date").value;
let milk = document.getElementById("milk").value;

if (!milkman) {
    alert(getText("Enter milkman name","दूधवाले का नाम डालें"));
    return;
}

if (date === "") {
    alert(getText("Please select date","तारीख चुनें"));
    return;
}

records.push({
    milkman: milkman,  // ✅ IMPORTANT
    date: date,
    milk: milk
});

save();
showRecord();

}



function showRecord(){

let div = document.getElementById("record");
let totalDiv = document.getElementById("total");

let total = 0;

let html = `
<table>
<tr>
<th>Milkman</th>
<th>Date</th>
<th>Milk</th>
<th>Action</th>
</tr>
`;

records.forEach((r, index) => {

html += `
<tr>
<td>${r.milkman}</td>
<td>${r.date}</td>
<td>${r.milk}</td>
<td>
<button class="deleteBtn" onclick="deleteRecord(${index})">❌</button>
</td>
</tr>
`;

total += Number(r.milk);

});

html += "</table>";

div.innerHTML = html;

totalDiv.innerHTML =
"<h3>Total Milk: " + total + " L</h3>" +
"<h3>Total Money: ₹" + (total * 50) + "</h3>";

}

showRecord()

    window.onload = function () {
    let savedName = localStorage.getItem("milkmanName");

    if (savedName) {
        showMilkman(savedName);
    }
};

function saveMilkman() {
    let name = document.getElementById("milkmanName").value;

    if (name.trim() === "") return;

    localStorage.setItem("milkmanName", name);
    showMilkman(name);
}

function showMilkman(name) {
    document.getElementById("milkmanName").style.display = "none";
    document.getElementById("saveBtn").style.display = "none";

    let display = document.getElementById("milkmanDisplay");
    display.innerHTML = `
    <h3>Milkman - ${name}</h3>
    <button class="deleteBtn" onclick="deleteMilkman()">Delete</button>
`;
}

function deleteMilkman() {
    localStorage.removeItem("milkmanName");

    document.getElementById("milkmanName").style.display = "block";
    document.getElementById("saveBtn").style.display = "inline-block";

    document.getElementById("milkmanName").value = "";
    document.getElementById("milkmanDisplay").innerHTML = "";
}
function deleteRecord(index){

if(confirm(getText("Delete this record?","क्या रिकॉर्ड हटाना है?"))){
    records.splice(index, 1);
    save();
    showRecord();
}

}