// ==========================
// LANGUAGE SYSTEM
// ==========================
let lang = localStorage.getItem("lang") || "en";

function toggleLang(){
    lang = (lang === "en") ? "hi" : "en";
    localStorage.setItem("lang", lang);
    applyLang();
}

function setText(id, text){
    let el = document.getElementById(id);
    if(el) el.innerText = text;
}

function applyLang(){

    // CUSTOMER PANEL
    if(document.getElementById("milkmanList")){
        if(lang === "hi"){
            setText("title","ग्राहक कार्यक्षेत्र");
            setText("milkmanHeading","🥛 दूधवाला");
            setText("entryTitle","दूध हिसाब");
            setText("addMilkmanBtn","➕ दूधवाला जोड़ें");
            setText("addRecordBtn","दूध जोड़ें");
            setText("skipBtn","दिन छोड़ें");
            setText("popupTitle","दूधवाला जोड़ें");
        } else {
            setText("title","Customer Panel");
            setText("milkmanHeading","🥛 Milkmen");
            setText("entryTitle","Milk Entry");
            setText("addMilkmanBtn","➕ Add Milkman");
            setText("addRecordBtn","Add Record");
            setText("skipBtn","Skip Day");
            setText("popupTitle","Add Milkman");
        }
    }

    // MILKMAN PANEL
   if(document.getElementById("customerList")){

    if(lang === "hi"){

        setText("mm_title", "दूधवाला डैशबोर्ड");
        setText("mm_heading", "👥 ग्राहक");
        setText("mm_addBtn", "➕ ग्राहक जोड़ें");
        setText("mm_entryTitle", "दूध हिसाब");
        setText("mm_addMilkBtn", "दूध जोड़ें");
        setText("mm_skipBtn", "दिन छोड़ें");
        setText("popupTitle", "ग्राहक जोड़ें");

    } else {

        setText("mm_title", "Milkman Dashboard");
        setText("mm_heading", "👥 Customers");
        setText("mm_addBtn", "➕ Add Customer");
        setText("mm_entryTitle", "Milk Entry");
        setText("mm_addMilkBtn", "Add Milk");
        setText("mm_skipBtn", "Skip Day");
        setText("popupTitle", "Add Customer");

    }
}
}

// ==========================
// SAFE GET
// ==========================
function getData(key){
    try{
        let d = localStorage.getItem(key);
        return d ? JSON.parse(d) : [];
    }catch(e){
        return [];
    }
}

// ==========================
// PANEL DETECT
// ==========================
let isMilkman = document.getElementById("customerList");
let isCustomer = document.getElementById("milkmanList");

// ==========================
// 🥛 MILKMAN PANEL
// ==========================
let mm_customers = getData("mm_customers");
let mm_records = getData("mm_records");

function mm_save(){
    localStorage.setItem("mm_customers", JSON.stringify(mm_customers));
    localStorage.setItem("mm_records", JSON.stringify(mm_records));
}

// ADD CUSTOMER
function mm_addCustomer(){
    let name = document.getElementById("custName").value.trim();
    let rate = parseFloat(document.getElementById("custRate").value);

    if(!name || isNaN(rate)){
        alert("Enter name & rate");
        return;
    }

    if(mm_customers.includes(name)){
        alert("Customer exists");
        return;
    }

    mm_customers.push(name);
    localStorage.setItem("mm_rate_"+name, rate);

    mm_save();
    mm_loadCustomers();
    closePopup();
}

// LOAD
function mm_loadCustomers(){
    if(!isMilkman) return;

    let list = document.getElementById("customerList");
    let select = document.getElementById("customerSelect");

    list.innerHTML="";
    select.innerHTML="";

    mm_customers.forEach((c,i)=>{

        let data = mm_records.filter(r=>r.customer===c);

        let totalMilk = data.reduce((s,r)=> r.milk==="Skipped"?s:s+Number(r.milk),0);
        let rate = localStorage.getItem("mm_rate_"+c) || 50;
        let totalMoney = totalMilk * rate;

        list.innerHTML += `
        <div class="customer-card">
            <div>
                <strong>${c}</strong>
                <p>Milk: ${totalMilk} L</p>
                <p>Money: ₹${totalMoney}</p>
            </div>
            <div class="cust-actions">
                <button onclick="mm_deleteCustomer(${i})">❌</button>
                <button onclick="mm_selectCustomer('${c}')">👁️</button>
            </div>
        </div>`;

        select.innerHTML += `<option value="${c}">${c}</option>`;
    });

    mm_showRecord();
}

// SELECT
function mm_selectCustomer(name){
    document.getElementById("customerSelect").value = name;
    mm_showRecord();
}

// DELETE
function mm_deleteCustomer(i){
    let name = mm_customers[i];
    mm_customers.splice(i,1);
    mm_records = mm_records.filter(r=>r.customer!==name);
    mm_save();
    mm_loadCustomers();
}

// ADD MILK
function addMilk(){
    if(!isMilkman) return;

    let customer = document.getElementById("customerSelect").value;
    let date = document.getElementById("date").value;
    let milk = document.getElementById("milk").value;

    if(!date) return;

    mm_records.push({customer,date,milk});
    mm_save();

    mm_showRecord();
    mm_loadCustomers();
}

// SKIP
function skipDay(){
    if(isMilkman){
        let customer = document.getElementById("customerSelect").value;
        let date = document.getElementById("date").value;

        if(!date) return;

        mm_records.push({customer,date,milk:"Skipped"});
        mm_save();

        mm_showRecord();
        mm_loadCustomers();
    } else {
        cm_skipDay();
    }
}

// SHOW
function mm_showRecord(){
    if(!isMilkman) return;

    let select = document.getElementById("customerSelect");
    let box = document.getElementById("record");

    if(!select.value) return;

    let data = mm_records.filter(r=>r.customer===select.value);

    let html = `<table>
<tr><th>Customer</th><th>Date</th><th>Quantity</th><th>Action</th></tr>`;

    data.forEach((r,i)=>{
        html += `<tr>
<td>${r.customer}</td>
<td>${r.date}</td>
<td>${r.milk==="Skipped"?"Skipped":r.milk+" L"}</td>
<td><button class="deleteBtn" onclick="mm_deleteRecord(${i})">❌</button></td>
</tr>`;
    });

    let totalMilk = data.reduce((s,r)=> r.milk==="Skipped"?s:s+Number(r.milk),0);
    let rate = localStorage.getItem("mm_rate_"+select.value) || 50;
    let totalMoney = totalMilk * rate;

    html += `<tr>
<td colspan="4"><b>Total Milk:</b> ${totalMilk} L | <b>Total Money:</b> ₹${totalMoney}</td>
</tr></table>`;

    box.innerHTML = html;
}

// DELETE RECORD
function mm_deleteRecord(i){
    let customer = document.getElementById("customerSelect").value;
    let data = mm_records.filter(r=>r.customer===customer);
    let rec = data[i];

    let idx = mm_records.indexOf(rec);
    if(idx>-1){
        mm_records.splice(idx,1);
        mm_save();
        mm_showRecord();
        mm_loadCustomers();
    }
}

// ==========================
// 🧑‍🌾 CUSTOMER PANEL
// ==========================
let cm_milkmen = getData("cm_milkmen");
let cm_records = getData("cm_records");

function cm_save(){
    localStorage.setItem("cm_milkmen", JSON.stringify(cm_milkmen));
    localStorage.setItem("cm_records", JSON.stringify(cm_records));
}

// ADD MILKMAN
function addMilkman(){
    let name = document.getElementById("milkmanName").value.trim();
    let rate = parseFloat(document.getElementById("milkmanRate").value);

    if(!name || isNaN(rate)){
        alert("Enter name & rate");
        return;
    }

    if(cm_milkmen.includes(name)){
        alert("Milkman exists");
        return;
    }

    cm_milkmen.push(name);
    localStorage.setItem("cm_rate_"+name, rate);

    cm_save();
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

    cm_milkmen.forEach((m,i)=>{

        let data = cm_records.filter(r=>r.milkman===m);

        let totalMilk = data.reduce((s,r)=> r.milk==="Skipped"?s:s+Number(r.milk),0);
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
                <button onclick="selectMilkman('${m}')">👁️</button>
            </div>
        </div>`;

        select.innerHTML += `<option value="${m}">${m}</option>`;
    });

    showRecords();
}

// SELECT
function selectMilkman(name){
    document.getElementById("milkmanSelect").value = name;
    showRecords();
}

// DELETE
function deleteMilkman(i){
    let name = cm_milkmen[i];
    cm_milkmen.splice(i,1);
    cm_records = cm_records.filter(r=>r.milkman!==name);
    cm_save();
    loadMilkmen();
}

// ADD RECORD
function addRecord(){
    let milkman = document.getElementById("milkmanSelect").value;
    let date = document.getElementById("date").value;
    let milk = document.getElementById("milk").value;

    if(!date) return;

    cm_records.push({milkman,date,milk});
    cm_save();

    showRecords();
    loadMilkmen();
}

// SKIP
function cm_skipDay(){
    let milkman = document.getElementById("milkmanSelect").value;
    let date = document.getElementById("date").value;

    if(!date) return;

    cm_records.push({milkman,date,milk:"Skipped"});
    cm_save();

    showRecords();
    loadMilkmen();
}

// SHOW
function showRecords(){
    if(!isCustomer) return;

    let select = document.getElementById("milkmanSelect");
    let box = document.getElementById("records");

    if(!select.value) return;

    let data = cm_records.filter(r=>r.milkman===select.value);

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

    let totalMilk = data.reduce((s,r)=> r.milk==="Skipped"?s:s+Number(r.milk),0);
    let rate = localStorage.getItem("cm_rate_"+select.value) || 50;
    let totalMoney = totalMilk * rate;

    html += `<tr>
<td colspan="4"><b>Total Milk:</b> ${totalMilk} L | <b>Total Money:</b> ₹${totalMoney}</td>
</tr></table>`;

    box.innerHTML = html;
}

// DELETE RECORD
function deleteRecordCustomer(i){
    let milkman = document.getElementById("milkmanSelect").value;
    let data = cm_records.filter(r=>r.milkman===milkman);
    let rec = data[i];

    let idx = cm_records.indexOf(rec);
    if(idx>-1){
        cm_records.splice(idx,1);
        cm_save();
        showRecords();
        loadMilkmen();
    }
}

// ==========================
// POPUP
// ==========================
function openPopup(){
    document.getElementById("popup").style.display="flex";
}

function closePopup(){
    document.getElementById("popup").style.display="none";
}

// ==========================
// INIT
// ==========================
window.onload = function(){

    if(isMilkman) mm_loadCustomers();
    if(isCustomer) loadMilkmen();

    applyLang();
};