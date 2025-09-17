param(
  [Parameter(Mandatory=$true)][string]$SiteUrl
)

# helpers
function AddText($list,$title){ m365 spo field add --webUrl $SiteUrl --listTitle $list --title $title --type Text --addToDefaultView 2>$null }
function AddNote($list,$title){ m365 spo field add --webUrl $SiteUrl --listTitle $list --title $title --type Note 2>$null }
function AddNum($list,$title){  m365 spo field add --webUrl $SiteUrl --listTitle $list --title $title --type Number --addToDefaultView 2>$null }
function AddBool($list,$title){ m365 spo field add --webUrl $SiteUrl --listTitle $list --title $title --type Boolean --addToDefaultView 2>$null }
function AddDate($list,$title){ m365 spo field add --webUrl $SiteUrl --listTitle $list --title $title --type DateTime --addToDefaultView 2>$null }
function AddUser($list,$title){ m365 spo field add --webUrl $SiteUrl --listTitle $list --title $title --type User --addToDefaultView 2>$null }
function AddUsers($list,$title){ m365 spo field add --webUrl $SiteUrl --listTitle $list --title $title --type UserMulti --addToDefaultView 2>$null }
function AddChoice($list,$title,$choices){ m365 spo field add --webUrl $SiteUrl --listTitle $list --title $title --type Choice --choices "$choices" --addToDefaultView 2>$null }
function AddLookup($list,$displayName,$targetList,$showField="Title"){
  $xml = "<Field DisplayName='$displayName' Type='Lookup' Required='TRUE' List='Lists/$targetList' ShowField='$showField' StaticName='$displayName' Name='$displayName'/>"
  m365 spo field add --webUrl $SiteUrl --listTitle $list --xml $xml 2>$null
}

# 0) Create lists
m365 spo list add --webUrl $SiteUrl --title "Cap Variance Tracker" --baseTemplate GenericList 2>$null
m365 spo list add --webUrl $SiteUrl --title "Cap Tickets" --baseTemplate GenericList 2>$null
m365 spo list add --webUrl $SiteUrl --title "Cap Ticket Units" --baseTemplate GenericList 2>$null

# 1) Cap Tickets (ticket header)
AddText  "Cap Tickets" "Ticket Title"
AddText  "Cap Tickets" "Ticket ID"
AddUser  "Cap Tickets" "Finance Partner"
AddUsers "Cap Tickets" "Tagged Participants"
AddChoice "Cap Tickets" "Status" "No Ticket,Pending Other,Invoices Requested,BA Research,Awaiting Feedback,Resolved,Closed (not on variance list)"
AddBool  "Cap Tickets" "Follow-up Required"
AddNote  "Cap Tickets" "Notes"
AddDate  "Cap Tickets" "Status Start"
AddNote  "Cap Tickets" "Status History"

# 2) Cap Ticket Units (junction + BA per-vehicle resolution)
AddLookup "Cap Ticket Units" "Ticket" "Cap Tickets"
AddLookup "Cap Ticket Units" "Vehicle" "Cap Variance Tracker"
AddChoice "Cap Ticket Units" "BA Resolution" "Sales Rerate,Finance to Rebill,VA to CAP,VA to Expense,VA to Write-off,Correction due from OEM,Other"
AddNote  "Cap Ticket Units" "BA Resolution Notes"
AddDate  "Cap Ticket Units" "BA Resolution Date"
AddBool  "Cap Ticket Units" "Closed"
AddText  "Cap Ticket Units" "State"

# 3) Cap Variance Tracker (FULL set you provided)

# Text
AddText "Cap Variance Tracker" "Vehicle"
AddText "Cap Variance Tracker" "Area"
AddText "Cap Variance Tracker" "CBU Name"
AddText "Cap Variance Tracker" "PL"
AddText "Cap Variance Tracker" "Units to be Reviewed by Field - 4 months from depreciation date >= and over $2500"
AddText "Cap Variance Tracker" "Field Comments"
AddText "Cap Variance Tracker" "VA Notes"
AddText "Cap Variance Tracker" "First Rept"
AddText "Cap Variance Tracker" "Lessee Name"
AddText "Cap Variance Tracker" "Action"
AddText "Cap Variance Tracker" "LN - Local SP"
AddText "Cap Variance Tracker" "FN - Local SP"
AddText "Cap Variance Tracker" "LN - Natl SP"
AddText "Cap Variance Tracker" "FN - Natl SP"
AddText "Cap Variance Tracker" "OEM Surcharge Status"
AddText "Cap Variance Tracker" "Lump Sum Status"

# Numbers
AddNum "Cap Variance Tracker" "CBU No."
AddNum "Cap Variance Tracker" "LOC"
AddNum "Cap Variance Tracker" "Reason for Variance"
AddNum "Cap Variance Tracker" "Other Action"
AddNum "Cap Variance Tracker" "Sales Tax"
AddNum "Cap Variance Tracker" "Re-rate package"
AddNum "Cap Variance Tracker" "Reclass to 107.00/ 363.00"
AddNum "Cap Variance Tracker" "CAP"
AddNum "Cap Variance Tracker" "Bill to Customer"
AddNum "Cap Variance Tracker" "Expense"
AddNum "Cap Variance Tracker" "Subtotal"
AddNum "Cap Variance Tracker" "Check"
AddNum "Cap Variance Tracker" "Lessee#"
AddNum "Cap Variance Tracker" "Cnt"
AddNum "Cap Variance Tracker" "Total Act"
AddNum "Cap Variance Tracker" "Total Auth"
AddNum "Cap Variance Tracker" "Total Var"
AddNum "Cap Variance Tracker" "Overall Invoiced"
AddNum "Cap Variance Tracker" "Overall Auth"
AddNum "Cap Variance Tracker" "Overall Var"
AddNum "Cap Variance Tracker" "Cust Inserv"
AddNum "Cap Variance Tracker" "Depr Date"
AddNum "Cap Variance Tracker" "Ms Held"
AddNum "Cap Variance Tracker" "Pkg#"
AddNum "Cap Variance Tracker" "112.01 Chassis"
AddNum "Cap Variance Tracker" "112.02 Body"
AddNum "Cap Variance Tracker" "112.03 Paint"
AddNum "Cap Variance Tracker" "112.04 Misc."
AddNum "Cap Variance Tracker" "112.05 SCC"
AddNum "Cap Variance Tracker" "112.06 Tires"
AddNum "Cap Variance Tracker" "112.07 Rebate"
AddNum "Cap Variance Tracker" "112.08 Shelving"
AddNum "Cap Variance Tracker" "112.09 Refrigeration"
AddNum "Cap Variance Tracker" "112.10 Liftgate"
AddNum "Cap Variance Tracker" "112.11 Sales Tax"
AddNum "Cap Variance Tracker" "112.12 Freight"
AddNum "Cap Variance Tracker" "112.13 Purch Rev"
AddNum "Cap Variance Tracker" "112.14 Uncoded"
AddNum "Cap Variance Tracker" '112.15 "Write Offs"'
AddNum "Cap Variance Tracker" "112.16 Sale"
AddNum "Cap Variance Tracker" "Sam Code"
AddNum "Cap Variance Tracker" "Original NVI in ACS"
AddNum "Cap Variance Tracker" "OEM Surchage $"
AddNum "Cap Variance Tracker" "Pending OEM Rerate"
AddNum "Cap Variance Tracker" "Lump Sum $"
AddNum "Cap Variance Tracker" "Salesforce Variance"

# Choices
AddChoice "Cap Variance Tracker" "Status" "No Ticket,Pending Other,Invoices Requested,BA Research,Awaiting Feedback,Resolved,Closed (not on variance list)"
AddChoice "Cap Variance Tracker" "BA Resolution" "Sales Rerate,Finance to Rebill,VA to CAP,VA to Expense,VA to Write-off,Correction due from OEM,Other"
AddChoice "Cap Variance Tracker" "Closed Reason" "Resolved,No Action Needed,Transferred,Write-off,Other"
AddChoice "Cap Variance Tracker" "VA Resolution" "Re-Rate,Misc Billing,System Correction,Expense,Write-off,Amortize"

# Dates
AddDate "Cap Variance Tracker" "Closed"

# Helpful indexes
m365 spo field set --webUrl $SiteUrl --listTitle "Cap Tickets" --fieldTitle "Ticket ID" --Indexed true 2>$null
m365 spo field set --webUrl $SiteUrl --listTitle "Cap Ticket Units" --fieldTitle "Ticket" --Indexed true 2>$null
m365 spo field set --webUrl $SiteUrl --listTitle "Cap Ticket Units" --fieldTitle "Vehicle" --Indexed true 2>$null

Write-Host "✅ Schema created/updated at $SiteUrl"
