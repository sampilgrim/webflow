/*
Webflow class importer tool

This tool will loop through a list of user-provided classnames, and create a JSON block that can be pasted into a Webflow project, containing divs with each of these classes.

TO DO / NOTES
- NB if classes already exist then they will be renamed
- If the 'createdBy' field within the JSON for the styles is the same as the current WF user (?) then it merges styles - or at least doesn't rename.
- if the pasted element has the same class as an existing class, and the same WF user created it, but the styling are different, then both sets of CSS rules will exist, but the newer one will override the first simply by being later in the CSS file.
- Can we query Webflow Designer API to check if any of the classes already exist?
*/


/* JSON template */
var jsonBase = {
  "type": "@webflow/XscpData",
  "payload": {
    "nodes": [],
    "styles": [],
    "assets": [],
    "ix1": [],
    "ix2": {
      "interactions": [],
      "events": [],
      "actionLists": []
    }
  },
  "meta": {
    "unlinkedSymbolCount": 0,
    "droppedLinks": 0,
    "dynBindRemovedCount": 0,
    "dynListBindRemovedCount": 0,
    "paginationRemovedCount": 0
  }
}

/* JSON node template */
var jsonBase_node = {
        "_id": "",
        "type": "Block",
        "tag": "div",
        "classes": [],
        "children": [],
        "data": {
          "tag": "div"
        }
      }

/* JSON class teamplte */
var jsonBase_class = {
        "_id": "",
        "fake": false,
        "type": "class",
        "name": "",
        "namespace": "",
        "comb": "",
        "styleLess": "",
        "variants": {},
        "children": [],
        "createdBy": "",
        "selector": null
      }


/* loop through user's string and build JSON */      
function convertStylesToJSON(str, reg) {

	const arr = str.split(reg) /* split string into arr by comma, line break, whatever we've chosen */
  console.log(str)
  console.log(arr)

	var classNodes = [];
	var nodeNodes = [];

	for (var i = 0; i < arr.length; i++) {

      // var sanitisedClassName = arr[i].replace(/[^_a-zA-Z0-9-]/,""); /* Remove anything not a letter/number/underscore/hyphen. Bit heavy handed, but having some issues with weird hidden characters. */
      var sanitisedClassName = arr[i]; /* skipped sanitising for now */

      /* if name is not empty */
      if(sanitisedClassName.length > 0) {

        myClassNode = JSON.parse(JSON.stringify(jsonBase_class)); /* duplicate the template class node */
        myClassNode._id = ranHexStr([4,2,2,2,6]); /* generate a new id for class */
        myClassNode.name = sanitisedClassName; /* name class */

        myNodeNode = JSON.parse(JSON.stringify(jsonBase_node)); /* duplicate the template element node */
        myNodeNode._id = ranHexStr([4,2,2,2,6]); /* generate a new id for element */
        myNodeNode.classes[0] = myClassNode._id; /* give element the class */

        classNodes.push(myClassNode); /* make arrays of nodes */
        nodeNodes.push(myNodeNode);

      }
	}

  /* create parent node class */
  var parentClass = JSON.parse(JSON.stringify(jsonBase_class));
  parentClass._id = ranHexStr([4,2,2,2,6]);
  parentClass.name = "class-importer";

  /* create parent node to hold child nodes */
  var parentNode = JSON.parse(JSON.stringify(jsonBase_node));
  parentNode._id = ranHexStr([4,2,2,2,6]);
  parentNode.classes[0] = parentClass._id;
  
  /* add all IDs of child nodes to parent node */
  for (var i = 0; i < nodeNodes.length; i++) {
    parentNode.children.push(nodeNodes[i]._id);
  }

  /* add parent node to start of node array */
  nodeNodes.unshift(parentNode);
  classNodes.unshift(parentClass);

  /* duplicate and add our nodes to the overall template */
	jsonBase.payload.nodes = JSON.parse(JSON.stringify(nodeNodes)); 
	jsonBase.payload.styles = JSON.parse(JSON.stringify(classNodes));

	console.log(JSON.stringify(jsonBase))

  return JSON.stringify(jsonBase);

}


function ClassImporter(triggerEl, inputEl, stylesToConvert, separatorRegex) {

	document.addEventListener("copy", (event) => { /* listen for a copy event in this document */ /* TODO - can we limit this so it doesn't trigger off any other copying actions? */

    if(!stylesToConvert) {
      stylesToConvert = inputEl.value;
    }
		var myJSON = convertStylesToJSON(stylesToConvert, separatorRegex) /* get contents of text box and convert to Webflow JSON */

	  event.clipboardData.setData("application/json", myJSON); /* Save JSON to clipboard. NB - we don't need to use JSON.stringify if the code is already JSON - otherwise it escapes quote marks and breaks */

    event.preventDefault();
    console.log("copied to cb", myJSON);
	});

	triggerEl.onclick = function () { /* when button is clicked, fire a copy event */
	    document.execCommand("copy");
      triggerEl.innerText = "Classes copied!";
      triggerEl.disabled = true;
      myElement.disabled = true;
      document.getElementById("reset-button").style.display = "block";
	};

}

/* generate a random hex */
function ranHex(numBytes) {
    const bytes = crypto.getRandomValues(new Uint8Array(numBytes));
    const array = Array.from(bytes);
    const hexPairs = array.map(b => b.toString(16).padStart(2, '0'));
    return hexPairs.join('')
}

/* generate a random ID based on a defined structure */
function ranHexStr(array) {
	var hexArr = [];
	for (var i = 0; i < array.length; i++) {
		hexArr.push(ranHex(array[i]));
	}
	var hexStr = hexArr.join("-")
	return hexStr;
}

/* button to trigger copy action */
let myButton = document.getElementById("copy-button");

/* textarea containing classes */
let myElement = document.getElementById("class-text-area");

/* regex to split text content on */
let mySeparatorRegex = new RegExp(/[,\s\r\n]+/);

/* reload button */
document.getElementById("reset-button").onclick = function() {
	  window.location.reload();
}

ClassImporter(myButton, myElement, undefined, mySeparatorRegex);
