import React, { useState, useEffect } from "react";
import Checkbox from "./Checkbox.jsx"

function KWMLGoal(props) {
  const goalId = props.goalId
  const goal = props.goal
  const category = props.category
  const type = props.type
  const scope = props.scope
  const isPinned = props.isPinned
  const canBePinned = props.canBePinned
  const section = props.section
  const buttonLabel = () => {
    if (type === "Goal" && section === "All Goals"){ 
      return "Delete" 
    } else {
      return "Completed"
    }
  }

  const [currentGoal, setCurrentGoal] = useState({
    _id: goalId,
    goal: goal,
    category: category,
    type: type,
    scope: scope, 
    isPinned: isPinned
    });

  const [renderPin, setRenderPin] = useState(false)
  const [goalType, setGoalType] = useState("Goal") 
  const [goalHasBeenChanged, setGoalHasBeenChanged] = useState(false)

  function setType(){
    if (type === "Goal"){
      setGoalType("Goal")
    } else if (type === "Reminder"){
      setGoalType("Reminder")
    } else if (type === "Mindset"){
      setGoalType("Mindset")
    }
  }

  function definePinAction(){
    if (type === "Goal" && canBePinned === true) {
        setRenderPin(true)
    }
  }

  function defineButtonTitle(){
    if (type === "" && canBePinned === true) {
        setRenderPin(true)
    }
  }
  
  useEffect(() => {
    setType()
    definePinAction()
    defineButtonTitle()
  })

  function handleChange(event){
    const { name, value } = event.target;

    setGoalHasBeenChanged(true)
    
    setCurrentGoal(prevNote => {
        return {
          ...prevNote,
          [name]: value
        }
      });
    }

  function revertGoal(event){
    setCurrentGoal({goal:goal, category:category, type:type, scope:scope})
    event.preventDefault();
    setGoalHasBeenChanged(false)
  }

  function formSubmit(event){
    console.log(event)
    if (currentGoal.goal === "") {
      event.preventDefault();
    } else {
      setCurrentGoal({_id: goalId, goal:currentGoal.goal, category:category, type:type, scope:scope})
      setGoalHasBeenChanged(false)
      event.preventDefault();
    }
  }

  function toggle(value){
    var pinnedGoal = {
      category:category, 
      goal:currentGoal.goal, 
      name:currentGoal.name, 
      scope:scope, 
      type:type, 
      _id: goalId, 
      isPinned:value
    }
    setCurrentGoal(pinnedGoal)
    console.log(pinnedGoal)
    props.onChange(pinnedGoal)
  }

  return (
    <div className={"kwmlGoal " + category}>
      {renderPin ? 
        <Checkbox 
          state={props.isPinned}
          onChange={toggle} 
          />
        : null
      }
      <form onSubmit={formSubmit}>
            <textarea 
              onChange={handleChange}
              name="goal" 
              placeholder="Goal"
              rows="2" 
              value={currentGoal.goal}>
            </textarea>
        </form>


        { !goalHasBeenChanged ? 

          <div className="footer">
   
          <div className="kwmlGoalDiv" onClick={section === "All goals" ? () => (props.filterClick(category)) : null }>
            <p className={section === "All goals" ? "categoryFilter" : "category"}>
              {category}
            </p>
          </div>
          {goalType === "Goal" ? <p className={"scope"}>{scope + " goal"}</p> : <p className={"scope"}>{type}</p> }

          {goalType === "Goal" && section !== "All goals" ? 
          <form onSubmit={formSubmit}>
            <button name="delete"
              onClick={() => (props.deleteClick(props.id, currentGoal, props.array, props.setArray))}>Completed
            </button>
          </form> : null }

          {(goalType === "Reminder" || goalType === "Mindset") && section !== "All goals" ? 
          <div className="blank"></div> : null }

          {section === "All goals" ? 
          <form onSubmit={formSubmit}>
            <button name="delete"
              onClick={() => (props.deleteClick(props.id, currentGoal, props.array, props.setArray))}>Delete
            </button>
          </form> : null }
         </div>
        :
        <div className="alterFooter">
          <button onClick={() => { props.onChange(currentGoal); setGoalHasBeenChanged(false); }}>
            Update
          </button> 
          <button onClick={revertGoal}>
            Cancel
          </button>
        </div> 
        }

       </div>
  
  );
}

export default KWMLGoal;
