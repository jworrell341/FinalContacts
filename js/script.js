/**
// Author: Jason Worrell
// Creation Date: April 28, 2015
// Revised:
// Note: Choose a person to contact
// 			 And send user to phone
// 			 number selected using phone's 
//       built in call application
*/
//==============Global Variables=======================
//range of font sizes for most screens (in pixels):
var minPix = 15, maxPix = 40;
//raw csv data:
var contacts = "";
//array of contacts taken from the raw csv file:
var recordsArray = [];
var upperIndex = recordsArray.length;
var currentRecordIndex = 1;
//ajax object used to get csv file content from server
var ajax = new XMLHttpRequest();

//=================Responsive Size function(s)===========
//create a function that sets pixel size for viewports between 320 and 1920 pixels
var setMainPixels = liquidPixelFactory(320,1920);
//===============Event handlers =======================
window.addEventListener("load",init,false);
window.addEventListener("resize",resize,false);
//-----resize helper function----------
function resize(){
    S("content").fontSize = setMainPixels(minPix,maxPix) + "px";
}
//-------------clear the search text window-------------
O('clear').addEventListener("click", function(){
  O('searchText').value = "";
},false);
//------------ advance to the next record ------------------------
O("nextBtn").addEventListener("click",function(){
	upperIndex = recordsArray.length;
  if(currentRecordIndex < upperIndex -1){
    currentRecordIndex++;
    showRecord(currentRecordIndex);
  }
  else{
		//point to the first record
    currentRecordIndex = 1;
    showRecord(currentRecordIndex);
  }
},false);
//-------------- go back to the previous record --------------------------------------
O("backBtn").addEventListener("click", function(){
	upperIndex = recordsArray.length;
	if(currentRecordIndex > 1){
		currentRecordIndex--;
		showRecord(currentRecordIndex);
	}
	else{
		//point to the last record
		currentRecordIndex = upperIndex -1;
		showRecord(currentRecordIndex);
	}
}, false)

//---------------- telephone the contact --------------------
O("phone").onclick = function(){
    document.location = 'tel:' + O("phone").innerHTML.trim();
}
//----------------- search event handler ---------------
O("searchText").onkeyup = function(){
  //grab what has been typed
  var subString = O("searchText").value;
  //search all records for the first occurance of
  //this subString and display that record;
  searchRecords(subString);
}
//------- search Records function ----------
function searchRecords(string){
  // make the substring all lower case
  var string = string.toLowerCase();
  var max = recordsArray.length;
  //skip the title record (the zero-th record)
  for(var i=1; i < max; i++){
    //make the target lower cas as well
    var target = recordsArray[i].toLowerCase();
    // if there is a match, show it and end ....    
    if( target.indexOf(string) !== -1 ){
      //show that record, and you're done!
      showRecord(i);
      //done break;
      break;
    }
  }
}
//----------------------------------------------------
//======================================================
/*
Store our csv file locally if localStorage
is supported.
*/
function init(){
	var path = "docs/contacts.csv";
  resize();
  //check if localStorage is supported:
  //if so, see if our contacts are there ..
    // if they are not there,get them from the server (via ajax request)...
    // and 1.) save 'em to our contacts variable && then 2.)save in localStorage.
    // If they are already saved locally, put 'em into our contacts variable
  //if localStorage is not supported, then get contacts from server, and...
  // ...save them in our contacts variable (you can't save it to localStorage).
  if(!!localStorage){
    if(!localStorage.getItem("contacts")){
      ajax.open("GET", path, true);
      ajax.send();
      //=====================================
      ajax.onreadystatechange = function(){        
        if(ajax.readyState === 4){
          if(ajax.status === 200 || ajax.status === 0){
            // stores to our variable              
            contacts = ajax.response;
            //now store to browser
            localStorage.setItem("contacts", contacts);
            // put the response into our program's variable named "contacts".
            //(which also shows the first record )            
            makeRecords(contacts);
          }
          else{
            alert("Error from server: \n" + ajax.status);
          }
        }        
      }
    }
    else{//there was something stored: go get it.
      // put the response into our program's variable named "contacts".
      //(which also shows the first record )
        makeRecords( localStorage.getItem("contacts") );
    }
  }
  else{
    alert("local storage not supported");
    ajax.open("GET", path, true);
    ajax.send();    
    //event to handle ajax request done
    ajax.onload = function(){
      if(ajax.status === 200 || ajax.status === 0){
        //alert("Contacts: " + ajax.response);
        //store the response in our contacts variable
        contacts = ajax.response;
        makeRecords(contacts);
      }
      else{
        alert("Uh, oh! something went wrong.");
      }
    }
  }
  //-------------focus on the search window --------------
  O("searchText").focus();
}//end of init() function
//=============================================================
function makeRecords(csvString){
  contacts = csvString;
  recordsArray = contacts.split("\n");
  //sort the records alphabetically EXCLUDING the header
  var headerHolder = recordsArray.shift();
  recordsArray.sort();
  recordsArray.unshift(headerHolder);
  //display "first" contact
  showRecord(1);
}
//======================================
function showRecord(index){
  currentRecordIndex = index;
  var oneRecordArray = recordsArray[index].split(",");
  O("lastname").innerHTML = oneRecordArray[0];
  O("firstname").innerHTML = oneRecordArray[1];
  O("phone").innerHTML =  oneRecordArray[2];  
}
//=======================================



