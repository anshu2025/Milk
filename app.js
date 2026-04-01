// ============================

// ==========================
// LANGUAGE SYSTEM (SAFE)
// ==========================

let lang = localStorage.getItem("lang") || "en";

function toggleLang(){
    lang = (lang === "en") ? "hi" : "en";
    localStorage.setItem("lang", lang);
    applyLang();
}

function applyLang(){

    // =========================
    // CUSTOMER PANEL
    // =========================
    if(document.getElementById("milkmanList")){

        if(lang === "hi"){
            setText("title", "ग्राहक पैनल");
            setText("milkmanHeading", "🥛 दूधवाला");
            setText("entryTitle", "दूध एंट्री");
            setText("addMilkmanBtn", "➕ दूधवाला जोड़ें");
            setText("addRecordBtn", "रिकॉर्ड जोड़ें");
            setText("skipBtn", "दिन छोड़ें");
            setText("popupTitle", "दूधवाला जोड़ें");
            setText("popupAddBtn", "जोड़ें");
            setText("popupCancelBtn", "रद्द करें");
        } else {
            setText("title", "Customer Panel");
            setText("milkmanHeading", "🥛 Milkmen");
            setText("entryTitle", "Milk Entry");
            setText("addMilkmanBtn", "➕ Add Milkman");
            setText("addRecordBtn", "Add Record");
            setText("skipBtn", "Skip Day");
            setText("popupTitle", "Add Milkman");
            setText("popupAddBtn", "Add");
            setText("popupCancelBtn", "Cancel");
        }
    }

    // =========================
    // MILKMAN PANEL
    // =========================
    if(document.getElementById("customerList")){

        if(lang === "hi"){
            setText("mm_title", "दूधवाला डैशबोर्ड");
            setText("mm_heading", "👥 ग्राहक");
            setText("mm_addBtn", "➕ ग्राहक जोड़ें");
            setText("mm_entryTitle", "दूध एंट्री");
            setText("mm_addMilkBtn", "दूध जोड़ें");
            setText("mm_skipBtn", "दिन छोड़ें");
        } else {
            setText("mm_title", "Milkman Dashboard");
            setText("mm_heading", "👥 Customers");
            setText("mm_addBtn", "➕ Add Customer");
            setText("mm_entryTitle", "Milk Entry");
            setText("mm_addMilkBtn", "Add Milk");
            setText("mm_skipBtn", "Skip Day");
        }
    }
}

// ==========================
// SAFE TEXT SETTER
// ==========================
function setText(id, text){
    let el = document.getElementById(id);
    if(el) el.innerText = text;
}

// SAFE GET
// ============================
function getData(key){
    try{
        let data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }catch(e){
        return [];
    }
}

// ============================
// DETECT PANEL
// ============================
let isMilkman = document.getElementById("customerList");
let isCustomer = document.getElementById("milkmanList");

// ============================
// 🥛 MILKMAN PANEL
// ============================

let customers = getData("mm_customers");
let records = getData("mm_records");

function saveMM(){
    localStorage.setItem("mm_customers", JSON.stringify(customers));
    localStorage.setItem("mm_records", JSON.stringify(records));
}

// ADD CUSTOMER
function addCustomer(){
    let name = document.getElementById("custName")?.value.trim();
    if(!name) return;

    if(customers.includes(name)){
        alert("Customer exists");
        return;
    }

    customers.push(name);
    saveMM();

    document.getElementById("custName").value="";
    loadCustomers();
    closePopup();
}

// LOAD
function loadCustomers(){
    if(!isMilkman) return;

    let list = document.getElementById("customerList");
    let select = document.getElementById("customerSelect");

    list.innerHTML="";
    select.innerHTML="";

    customers.forEach((c,i)=>{

        let data = records.filter(r=>r.customer===c);

        let totalMilk = data.reduce((s,r)=>{
            return r.milk==="Skipped"?s:s+Number(r.milk);
        },0);

       let totalMoney = totalMilk * 50;

list.innerHTML += `
<div class="customer-card">
    <div>
        <strong>${c}</strong>
        <p>Milk: ${totalMilk} L</p>
        <p>Money: ₹${totalMoney}</p>
    </div>
    <div class="cust-actions">
        <button onclick="deleteCustomer(${i})">❌</button>
        <button onclick="selectCustomer('${c}')">📋</button>
    </div>
</div>`;

        select.innerHTML += `<option value="${c}">${c}</option>`;
    });

    showRecord();
}

function selectCustomer(name){
    document.getElementById("customerSelect").value = name;
    showRecord();
}

function deleteCustomer(i){
    let name = customers[i];
    customers.splice(i,1);
    records = records.filter(r=>r.customer!==name);
    saveMM();
    loadCustomers();
}

// ADD MILK
function addMilk(){
    let customer = document.getElementById("customerSelect").value;
    let date = document.getElementById("date").value;
    let milk = document.getElementById("milk").value;

    if(!date) return;

    records.push({customer,date,milk});
    saveMM();

    showRecord();
    loadCustomers();
}

// SKIP
function skipDay(){
    if(isMilkman){
        let customer = document.getElementById("customerSelect").value;
        let date = document.getElementById("date").value;

        if(!date) return;

        records.push({customer,date,milk:"Skipped"});
        saveMM();

        showRecord();
        loadCustomers();
    }
}

// SHOW
function showRecord(){
    if(!isMilkman) return;

    let select = document.getElementById("customerSelect");
    let box = document.getElementById("record");

    if(!select || !box || !select.value) return;

    let data = records.filter(r=>r.customer===select.value);

    let html = `<table>
<tr><th>Customer</th><th>Date</th><th>Quantity</th><th>Action</th></tr>`;

    data.forEach((r,i)=>{
        html += `<tr>
<td>${r.customer}</td>
<td>${r.date}</td>
<td>${r.milk==="Skipped"?"Skipped":r.milk+" L"}</td>
<td><button class="deleteBtn" onclick="deleteRecord(${i})">❌</button></td>
</tr>`;
    });

    html += "</table>";
    box.innerHTML = html;

    let totalMilk = data.reduce((s,r)=>{
    return r.milk==="Skipped" ? s : s + Number(r.milk);
},0);

let totalMoney = totalMilk * 50;

html += `
<tr>
<td colspan="4">
<b>Total Milk:</b> ${totalMilk} L |
<b>Total Money:</b> ₹${totalMoney}
</td>
</tr>`;
}

function deleteRecord(i){
    let select = document.getElementById("customerSelect").value;
    let data = records.filter(r=>r.customer===select);
    let rec = data[i];

    let idx = records.indexOf(rec);
    if(idx>-1){
        records.splice(idx,1);
        saveMM();
        showRecord();
        loadCustomers();
    }
}

// ============================
// 🧑‍🌾 CUSTOMER PANEL
// ============================

let milkmen = getData("cm_milkmen");
let custRecords = getData("cm_records");

function saveCM(){
    localStorage.setItem("cm_milkmen", JSON.stringify(milkmen));
    localStorage.setItem("cm_records", JSON.stringify(custRecords));
}

// ADD MILKMAN
function addMilkman(){
    let name = document.getElementById("milkmanName")?.value.trim();
    let rate = parseFloat(document.getElementById("milkmanRate")?.value);

    if(!name) return;

    if(milkmen.includes(name)){
        alert("Milkman exists");
        return;
    }

    milkmen.push(name);
    localStorage.setItem("cm_rate_"+name, rate||50);

    saveCM();

    document.getElementById("milkmanName").value="";
    document.getElementById("milkmanRate").value="";

    loadMilkmen();
    closePopup();
}

// LOAD
function loadMilkmen(){
    if(!isCustomer) return;

    let list = document.getElementById("milkmanList");
    let select = document.getElementById("milkmanSelect");

    list.innerHTML="";
    select.innerHTML="";

    milkmen.forEach((m,i)=>{

        let data = custRecords.filter(r=>r.milkman===m);

        let totalMilk = data.reduce((s,r)=>{
            return r.milk==="Skipped"?s:s+Number(r.milk);
        },0);

    let rate = localStorage.getItem("cm_rate_"+m) || 50;
let totalMoney = totalMilk * rate;

list.innerHTML += `
<div class="customer-card">
    <div>
        <strong>${m}</strong>
        <p>Milk: ${totalMilk} L</p>
        <p>Money: ₹${totalMoney}</p>
    </div>
    <div class="cust-actions">
        <button onclick="deleteMilkman(${i})">❌</button>
        <button onclick="selectMilkman('${m}')">📋</button>
    </div>
</div>`;

        select.innerHTML += `<option value="${m}">${m}</option>`;
    });

    showRecords();
}

function selectMilkman(name){
    document.getElementById("milkmanSelect").value = name;
    showRecords();
}

function deleteMilkman(i){
    let name = milkmen[i];
    milkmen.splice(i,1);
    custRecords = custRecords.filter(r=>r.milkman!==name);
    saveCM();
    loadMilkmen();
}

// ADD RECORD
function addRecord(){
    let milkman = document.getElementById("milkmanSelect").value;
    let date = document.getElementById("date").value;
    let milk = document.getElementById("milk").value;

    if(!date) return;

    custRecords.push({milkman,date,milk});
    saveCM();

    showRecords();
    loadMilkmen();
}

// SKIP
function skipDayCustomer(){
    let milkman = document.getElementById("milkmanSelect").value;
    let date = document.getElementById("date").value;

    if(!date) return;

    custRecords.push({milkman,date,milk:"Skipped"});
    saveCM();

    showRecords();
    loadMilkmen();
}

// SHOW
function showRecords(){
    if(!isCustomer) return;

    let select = document.getElementById("milkmanSelect");
    let box = document.getElementById("records");

    if(!select || !box || !select.value) return;

    let data = custRecords.filter(r=>r.milkman===select.value);

    let html = `<table>
<tr><th>Milkman</th><th>Date</th><th>Quantity</th><th>Action</th></tr>`;

    data.forEach((r,i)=>{
        html += `<tr>
<td>${r.milkman}</td>
<td>${r.date}</td>
<td>${r.milk==="Skipped"?"Skipped":r.milk+" L"}</td>
<td><button class="deleteBtn" onclick="deleteRecordCustomer(${i})">❌</button></td>
</tr>`;
    });

    html += "</table>";
    box.innerHTML = html;

    let totalMilk = data.reduce((s,r)=>{
    return r.milk==="Skipped" ? s : s + Number(r.milk);
},0);

let rate = localStorage.getItem("cm_rate_"+select.value) || 50;
let totalMoney = totalMilk * rate;

html += `
<tr>
<td colspan="4">
<b>Total Milk:</b> ${totalMilk} L |
<b>Total Money:</b> ₹${totalMoney}
</td>
</tr>`;
}

function deleteRecordCustomer(i){
    let select = document.getElementById("milkmanSelect").value;
    let data = custRecords.filter(r=>r.milkman===select);
    let rec = data[i];

    let idx = custRecords.indexOf(rec);
    if(idx>-1){
        custRecords.splice(idx,1);
        saveCM();
        showRecords();
        loadMilkmen();
    }
}

// ============================
// COMMON POPUP
// ============================
function openPopup(){
    document.getElementById("popup").style.display="flex";
}

function closePopup(){
    document.getElementById("popup").style.display="none";
}

// ============================
// INIT
// ============================
window.onload = function(){

    if(isMilkman){
        loadCustomers();
    }

    if(isCustomer){
        loadMilkmen();
    }
};