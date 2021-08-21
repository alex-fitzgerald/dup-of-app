import React,{ useState, useEffect, setState } from "react";
import Stoic from "./components/Stoic.jsx";
import axios from "axios"
import Poem from "./components/Poem.jsx";
import KWMLGoal from "./components/KWMLGoal.jsx";
import CreateArea from "./components/CreateArea.jsx";


function App() {
  const [randomStoic, setRandomStoic] = useState({quote: "Loading", author: ""});
  const [dailyPoem, setDailyPoem] = useState({poemTitle: "Loading", poemAuthor: "", poemLines: [""]});
  const [kwmlGoals, setKwmlGoals] = useState([]);
  const [goalsFiltered, setGoalsFiltered] = useState(false);
  const [dailyGoals, setDailyGoals] = useState([{
    goal: "Loading", category: "", scope: [""]}, {
    goal: "Loading", category: "", scope: [""]}, {
    goal: "Loading", category: "", scope: [""]}, {
    goal: "Loading", category: "", scope: [""]}])
  const [allGoals, setAllGoals] = useState([]);
  const [goalsLoaded, setGoalsLoaded] = useState(false);

  function addGoal(kwmlGoal){  
    setKwmlGoals(prevKwmlGoals => {
      return [...prevKwmlGoals, kwmlGoal]
    });
    postGoal(kwmlGoal);
  }
  
  function deleteKwmlGoal(id, goal, category) {
    setKwmlGoals(prevKwmlGoals => {
      return prevKwmlGoals.filter((kwmlGoals, index) => {
        return index !== id;
      });
    });
    deleteGoal(goal, category);
  }
  
  function postGoal(latestGoal){
    axios
    .post("/postGoals", {
      goal: latestGoal.goal,
      category: latestGoal.category,
    })
    .then(function () {
      console.log(latestGoal + "added to goals.");
    })
    .catch(function () {
				alert("Could not create goal. Please try again");
			});
    }
  
    function deleteGoal(goal, category){
      const url = "deleteGoals"
    console.log(goal, category)
    fetch(url , {
      headers: {'Content-Type': 'application/json' },
      method: "POST",
      mode: 'cors',
      body: JSON.stringify({
        goal: goal,
        category: category
      })
    })
    .then(response => response.json())
    .then(data => this.setState({ postId: data.id }));
  }
  
  function findDailyGoals(){
    if (goalsLoaded === true) {
    function getRandomNumber(arrayLength){
      return Math.floor(Math.random() * arrayLength);
    }

    let filteredGoals = kwmlGoals.filter(goal => goal.scope === "Daily");
    let filteredKingGoals = filteredGoals.filter(goal => goal.category === "King");
    let filteredWarriorGoals = filteredGoals.filter(goal => goal.category === "Warrior");
    let filteredMagicianGoals = filteredGoals.filter(goal => goal.category === "Magician");
    let filteredLoverGoals = filteredGoals.filter(goal => goal.category === "Lover");
    
    let kingDaily = filteredKingGoals[ getRandomNumber(filteredKingGoals.length) ];
    let warriorDaily = filteredWarriorGoals[ getRandomNumber(filteredWarriorGoals.length) ];
    let magicianDaily = filteredMagicianGoals[ getRandomNumber(filteredMagicianGoals.length) ];
    let loverDaily = filteredLoverGoals[ getRandomNumber(filteredLoverGoals.length) ];

    console.log(kingDaily)

    setDailyGoals([kingDaily, warriorDaily, magicianDaily, loverDaily]);
    }
  }
  
  function filterGoals(selectedCategory) {
    if (!goalsFiltered) {
      let filteredGoals = kwmlGoals.filter(goal => goal.category === selectedCategory);
    setKwmlGoals(filteredGoals);
    setGoalsFiltered(true);
    console.log(kwmlGoals)
  } else {
    console.log(allGoals)
    setKwmlGoals(allGoals);
    setGoalsFiltered(false);
  }
  }
  
  useEffect(() => {
    fetch("api", {
      headers : {
        "Content-Type": "applications/json",
        "Accept": "application/json"
      }
    })
    .then((res) => res.json())
    .then(function(data){
      setDailyPoem(JSON.parse(data.poem))
      setRandomStoic(JSON.parse(data.stoic))
      setKwmlGoals(JSON.parse(data.kwmlgoals))
      setAllGoals(JSON.parse(data.kwmlgoals))
      setGoalsLoaded(true)
      })
    }, []);

    
    return (
    <div className="app">
      <Stoic stoicInput = {randomStoic} />
      <Poem poemInput = {dailyPoem} />
      <CreateArea onAdd={addGoal} />

      <div>
        <button onClick={findDailyGoals}>Fetch daily goals</button>
        <h1>Daily Goals</h1>
        {dailyGoals.map((dailyGoal, index) => ( 
            <KWMLGoal 
              key={index}
              id={index} 
              goal={dailyGoal.goal}
              category={dailyGoal.category} 
              scope={dailyGoal.scope} 
              deleteClick={deleteKwmlGoal}
              filterClick={filterGoals}
              /> )) 
          } 
      </div>

      <div>
        <h1>All Goals</h1>
        {kwmlGoals.map((kwmlGoal, index) => ( 
          <KWMLGoal 
            key={index}
            id={index} 
            goal={kwmlGoal.goal}
            category={kwmlGoal.category} 
            scope={kwmlGoal.scope} 
            deleteClick={deleteKwmlGoal}
            filterClick={filterGoals}
            /> ))
          }
      </div>
    </div>
  );
}

export default App;