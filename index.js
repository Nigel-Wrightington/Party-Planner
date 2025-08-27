// //this gives access to the API which has stored information we will be using for this project.
const API = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2506-ftb-ct-web-pt/events";

//---state variable---\\
//this one variable is an object with properties that we want to update depending on what user interacts with.
let state = {
  
    //list of all the fetched events
  events: [],

  //shows which event is clicked and keeps is null by default if none is picked.
  selectedEvent: null,
};


//---Functions concerning the use of the API---\\


// we want these API fetch requests to be async functions because it will load the rest of the page while waiting for this to return its "promise." While waiting, it will not run the rest of its scoped function code.
async function getEvents(){
    try{
        //creating a variable that stores the pulled the proper response from the API. The API is contructed of base URL, our class code, and then /events to be accessed.
        const response = await fetch(API);

        // checking to see if the results were pulled correctly from API. if
        if(!response.ok) throw new Error("Failed to fetch events");

        const results = await response.json();

        return results.data;
    }
    //part of the try catch method, you put in the logic of what it presents to user when it encounters an error. Returns empty array if errors.
    catch (error) {
        console.error(error);
        alert("Error fetching events");
        return [];
    }
}

//need another asynch function to grab the individual event details now. Same logic but with ID now.
async function getEventById(id){
    try{
    const response = await fetch(`${API}/${id}`);
    if(!response.ok) throw new Error("Failed to fetch event details");
    const results = await response.json(); //this code grabs json info from API and turns it into JavaScript
    return results.data;
    }

    catch (error){
        console.error(error);
        alert("Error fetching party details");
        return null; //returns null if it can't return proper results.
    }
}


//---Component (UI) functions---\\
//these functions will create the UI elements on the page.

function eventList(events){
    //this code creates the HTML elements and inserts text into the h2.
    const container = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = "Upcoming Events";
    //then we need to append the title to the container using appendChild. This makes title the child of the div container.
    container.appendChild(title);

    const ul = document.createElement("ul");


    //now we need to loop through the array of all events, and create an li for each event. We can also add some css elements here like cursor functionality.
    events.forEach(event => {
        const li = document.createElement("li");
        li.textContent = event.name;
        li.style.cursor = "pointer";

        //now we need functionality with the list items it will create. Such as an event listener for clicking and a response to that event.
        li.addEventListener("click", async () => {
            const details = await getEventById(event.id);
            setState({ selectedEvent: details});
            //when clicked, it will run an async function (we dont want to hold up the page loading) to grab info from API
            //that describe the event and update the state variable selectedEvent after its pulled.



        });

        //append the now-created li events to be the child of the ul we created
        ul.appendChild(li);

    });

    //then append the ul to the original container at the beginning of the function
    container.appendChild(ul);
    return container;

}

//now we need a function that provides those details and creates the components for the details when displayed.
//first we're gonna start by creating the fallback message which tells user to select an event.
function eventDetails(event){
    const container = document.createElement("div");

    //if an event isn't chosen, it will present a p element with the text content in it.
    if(!event){
    const message = document.createElement("p");
    message.textContent = "Please select an event to see details";

    //elements wont parent or child within eachother without appending so remember we need to  append the p(message) to our div(container)
    //the div is simply a container to hold our p here.
    container.appendChild(message);
    return container;

    }
    //now we need to create the component UI for displaying the details of each event when clicked.
    const title = document.createElement("h2");
    title.textContent = event.name;

    const id = document.createElement("p");
    id.textContent = `ID: ${event.id}`;

    const date = document.createElement("p");
    date.textContent = `Date: ${event.date}`;

    const location = document.createElement("p");
    location.textContent = `Location: ${event.location}`;

    const description = document.createElement("p");
    description.textContent = `Description: ${event.description}`;

    //now its time to append all these components to the div container

    container.appendChild(title);
    container.appendChild(id);
    container.appendChild(date);
    container.appendChild(location);
    container.appendChild(description);

    //dont forget to return the container at the end of this function!

    return container;

}

//===Render Function===\\

function render(){
    // we need access to the root which is the `app` id in body.
    const root = document.getElementById("app");
    root.innerHTML = ""; //this clears the old UI root DOM. Do this first.


    //then we rebuild it from scratch.

    const list = eventList(state.events);
    const details = eventDetails(state.selectedEvent);

    //now we need to append the rebuild to the root. And the root clears automatically first so you'll have a fresh slate to work with.
    
    root.appendChild(list);
    root.appendChild(details);
}

//===State Updater Function===\\

//we need to merge the new state with the old.
//This will call render() everytime state changes.

function setState(newState){
    state = { ...state, ...newState };
    render();
}





//We are going to have to use async and await because we will be waiting for the `promise` or data...to be returned.

async function init(){
    const events = await getEvents();
    setState({ events });
    render();
}

//FINALLY you need to initialize the app!
//this fetches the events and populates state

init();





