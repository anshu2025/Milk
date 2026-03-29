let customers = JSON.parse(localStorage.getItem("customers")) || [];
let records = JSON.parse(localStorage.getItem("records")) || [];

// SAVE
function save() {
    localStorage.setItem("customers", JSON.stringify(customers));
    localStorage.setItem("records", JSON.stringify(records));
}

// POPUP
function openPopup(){ document.getElementById("popup").style.display="flex"; }
function closePopup(){ document.getElementById("popup").style.display="none"; }

// ADD CUSTOMER
function addCustomer(){
    let name = document.getElementById("custName").value.trim();
    if(!name) return;
    customers.push(name);
    save();
    document.getElementById("custName").value="";
    loadCustomers();
    closePopup();
}

// LOAD CUSTOMERS WITH MINI DASHBOARD
function loadCustomers() {
    let list = document.getElementById("customerList");
    let select = document.getElementById("customerSelect"); // Milk Entry select
    list.innerHTML = "";
    select.innerHTML = "";

    customers.forEach((c, index) => {
        // Total milk & money for card
        let custRecords = records.filter(r => r.customer === c);
        let totalMilk = custRecords.reduce((sum,r)=>sum+Number(r.milk),0);
        let totalMoney = totalMilk*50;

        // Customer card
        list.innerHTML += `
        <div class="customer-card">
            <div>
                <strong>${c}</strong>
                <p>Milk: ${totalMilk} L</p>
                <p>Money: ₹${totalMoney}</p>
            </div>
            <div class="cust-actions">
                <button onclick="deleteCustomer(${index})">❌</button>
                <button onclick="showCustomerRecords('${c}')">📋</button>
            </div>
        </div>`;

        // Add to select box
        select.innerHTML += `<option>${c}</option>`;
    });
}

// DELETE CUSTOMER
function deleteCustomer(i){
    if(confirm("Delete this customer and all their records?")){
        let custName = customers[i];
        customers.splice(i,1);
        records = records.filter(r=>r.customer!==custName);
        save();
        loadCustomers();
        showRecord();
    }
}

// ADD MILK
function addMilk(){
    let customer = document.getElementById("customerSelect").value;
    let date = document.getElementById("date").value;
    let milk = document.getElementById("milk").value;
    if(!date){ alert("Select date"); return; }
    records.push({customer,date,milk});
    save();
    showRecord();
}

// SHOW RECORD FOR SELECTED CUSTOMER
function showRecord(){
    let customer = document.getElementById("customerSelect").value;
    let filtered = records.filter(r=>r.customer===customer);
    let total = filtered.reduce((s,r)=>s+Number(r.milk),0);

    let html = `<table>
<tr><th>Customer</th><th>Date</th><th>Milk</th><th>Action</th></tr>`;
    filtered.forEach((r,i)=>{
        html+=`<tr>
<td>${r.customer}</td><td>${r.date}</td><td>${r.milk}</td>
<td><button class="deleteBtn" onclick="deleteRecordByCustomer('${customer}',${i})">❌</button></td>
</tr>`;
    });
    html+="</table>";
    document.getElementById("record").innerHTML=html;
    document.getElementById("total").innerHTML=
        `<h3>Total Milk for ${customer}: ${total} L</h3>
         <h3>Total Money: ₹${total*50}</h3>`;
}

// DELETE RECORD BY CUSTOMER
function deleteRecordByCustomer(customer,index){
    let custRecords = records.filter(r=>r.customer===customer);
    let rec = custRecords[index];
    let idx = records.indexOf(rec);
    if(idx>-1){ records.splice(idx,1); save(); showRecord(); }
}

// SHOW CUSTOMER RECORDS IN CENTER PANEL
function showCustomerRecords(customer){
    document.getElementById("customerSelect").value = customer;
    showRecord();
}

// DASHBOARD (Optional right panel)
function showDashboard(){
    let cust = document.getElementById("viewCustomer").value;
    let total = records.filter(r=>r.customer===cust).reduce((s,r)=>s+Number(r.milk),0);
    document.getElementById("dashboard").innerHTML=
        `<h3>${cust}</h3><p>Total Milk: ${total} L</p><p>Total Money: ₹${total*50}</p>`;
}

// EVENT LISTENER
document.getElementById("customerSelect").addEventListener("change", showRecord);

// INIT
window.onload=function(){ loadCustomers(); showRecord(); }

