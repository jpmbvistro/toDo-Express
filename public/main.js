var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");
let thumbDown = document.querySelectorAll('.fa-thumbs-down')
console.log('loading in')
Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(thumbDown).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbDown = parseFloat(this.parentNode.parentNode.childNodes[7].innerText)
        fetch('tDown', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbDown':thumbDown
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});


/* Make a checklist

//button adds another check-item with blank textinput and checkbox

//stage a task to be added and then add to list of tasks when entered or another task is set to stage

//when checked, animate strikethrough

//additems
//ul in html suggestions
//li is added
//2 buttons
//clear all /remove all li
//clear completed remove tasks that are marked completed
//total of active tasks
*/

// const taskList = []
const main = document.querySelector('#main')
const tasksHTML = main.querySelector('#list-items')
const taskCount = main.querySelector('#task-count')
const completeCount = main.querySelector('#complete-count')
main.querySelectorAll('.task').forEach((item,i)=>{
  let textBox = item.querySelector('input')
  textBox.addEventListener('click', completeTask)
  textBox.addEventListener('keyup', textBoxCheck)
  textBox.addEventListener('blur', removeFocus)
})
main.querySelectorAll('.edit').forEach((item, i)=>{
  item.addEventListener('click', editTask)
})
document.querySelector('#add-task').addEventListener('click', addListen)

document.querySelector('#reset-button').addEventListener('click', reset)
document.querySelector('#clear-complete-button').addEventListener('click', clear)




/*
Adds a new staged task if current staged task has content
*/
function addListen(){
  let currentStaged =tasksHTML.querySelector('.stage')
  let currentStagedContent = tasksHTML.querySelector('.stage .task-box')
  // console.log(currentStagedContent)
  // console.log(currentStagedContent.value)
  if (currentStagedContent.value.length>0){
    //take current staged task and add to database
    fetch('listItems', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'taskContent': currentStagedContent.value,
        'isComplete': currentStaged.classList.contains('complete')
      })

    }).then(function (response) {
      window.location.reload()
    })
    //Will not run following while application is synchronous
    currentStaged.classList.remove('stage')
    stageTask()


  }
}
// tasksHTML.querySelector('.stage').classList.remove('stage')

// Removes all list items and sets up new task to be added
function reset(){
  // let tasks = tasksHTML.querySelectorAll('li')
  // Array.from(tasks).forEach(task => task.remove())
  // taskCount.innerText=0
  // completeCount.innerText=0
  // stageTask()
  const name = this.parentNode.parentNode.childNodes[1].innerText
  const msg = this.parentNode.parentNode.childNodes[3].innerText
  fetch('reset', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // 'name': name,
      // 'msg': msg
    })
  }).then(function (response) {
    window.location.reload()
  })
}

function deleteTask(li){
  fetch('removeEmpty', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: li.id
    })
  }).then(function (response) {
    window.location.reload()
  })
}

//Removes all completed items
function clear(){
  fetch('clearComplete', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // 'name': name,
      // 'msg': msg
    })
  }).then(function (response) {
    window.location.reload()
  })
  // let completedTasks = Array.from(tasksHTML.querySelectorAll('.complete'))
  // console.log(`found ${completedTasks.length} completed tasks`);
  // if(completedTasks.length>0){
  //   completedTasks.forEach(task => {
  //     task.remove()
  //     taskCount.innerText = Number(taskCount.innerText) - 1
  //   })
  //   completeCount.innerText=0
  //
  //   //stage if no tasks or if there is no staged task
  //   console.log(`Tasks left: ${Number(taskCount.innerText)}`);
  //   if(Number(taskCount.innerText)===0 || tasksHTML.querySelector('.stage')===null){
  //     stageTask()
  //   }
  // }
}



/*
Sets up a new task item in dom
*/
function stageTask() {


  let editButton = document.createElement('button')
  editButton.classList.add('hover', 'edit', 'main-action')
  editButton.addEventListener('click', editTask)
  editButton.innerText = "EDIT"


  let textbox = document.createElement('input')
  textbox.setAttribute( 'type', 'text')
  textbox.classList.add('task-box')
  textbox.setAttribute('placeholder', 'What should I do?')
  textbox.setAttribute('size', '30?')
  textbox.setAttribute('max-length', '30')
  textbox.addEventListener('keyup', textBoxCheck)
  textbox.addEventListener('click', completeTask)
  textbox.addEventListener('blur', removeFocus)

  let li = document.createElement('li')
  li.classList.add('task', 'stage', 'flex-container', 'task-item', 'flex-xy-center')

  //add to DOM
  li.appendChild(textbox)
  li.appendChild(editButton)
  tasksHTML.appendChild(li)
  taskCount.innerText = Number(taskCount.innerText)+1

  textbox.focus()
}

/*
Allows Task editing for corresponding task
*/
function editTask(click){
  let textbox =click.currentTarget.previousElementSibling
  textbox.readOnly = !textbox.readOnly
  console.log('textbox')

  textbox.focus()
}

/*
To signify that textbox is done editing
*/
function textBoxCheck(event){
  // console.log(event.key)
  switch (event.key){
    case 'Enter':
      console.log('enter')
      event.currentTarget.blur()
      break
    case 'Backspace':
      console.log('backspace')
      if(event.currentTarget.value==''){
        event.currentTarget.classList.remove('strikethrough')
        event.currentTarget.parentElement.classList.remove('complete')
      }
      break;

    //supposedly for mac?
    case 'Delete':
      console.log('backspace')
      if(event.currentTarget.value==''){
        event.currentTarget.classList.remove('strikethrough')
        event.currentTarget.parentElement.classList.remove('complete')
      }
      break;
  }
}


/** Sends put request to update taskContent
Expects li
**/
function updateTask(domElement){
  fetch('updateTask', {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'id':domElement.id,
      'taskContent': domElement.querySelector('input').value,
      'isComplete': domElement.classList.contains('complete')
    })

  }).then(function (response) {
    console.log('Reloading!')
    window.location.reload()
  })
}

/*
Styles content with strikethrough
gives parent container class complete
*/
function completeTask(event) {
  if(event.currentTarget.value!==''&& event.currentTarget.readOnly) {
    console.log('completing task')
    fetch('listItems', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'taskContent': event.currentTarget.value,
        'isComplete': event.currentTarget.parentElement.classList.contains('complete')
      })

    }).then(function (response) {
      console.log('Reloading!')
      window.location.reload()
    })
    // if (event.currentTarget.parentElement.classList.contains('complete')) {
    //   completeCount.innerText = Number(completeCount.innerText)+1
    // } else {
    //   completeCount.innerText = Number(completeCount.innerText)-1
    // }
  }
  //if list item is empty, focus on item to enter task
  else if (event.currentTarget.value==''&& event.currentTarget.readOnly) {
    event.currentTarget.readOnly = false
    event.currentTarget.focus()
  }
}

/*
Fires when focus is removed
*/
function removeFocus(event) {
  console.log(`removing focus from`)
  console.log(event.currentTarget.parentElement)
  console.log(event.currentTarget.value)
  let li = event.currentTarget.parentElement
  if(li.classList.contains('stage') && event.currentTarget.value.length>0){
    console.log("adding New Item")
    addListen()
  } else if(li.classList.contains('stage')===false && event.currentTarget.value.length>0&&event.currentTarget.readOnly===false){
    console.log("Updating....")
    updateTask(li)
  } else if (li.classList.contains('stage')===false && event.currentTarget.value.length===0) {
    console.log("Deleting Empty")
    deleteTask(li)
  }
  // event.currentTarget.blur
  // event.currentTarget.readOnly = true
}


function setCount() {
  taskCount.innerText = main.querySelectorAll('.task').length - main.querySelectorAll('.stage').length - main.querySelectorAll('.complete').length
}

function setComplete(){
  completeCount.innerText = main.querySelectorAll('.complete').length
}

stageTask()//Preadd first item
setComplete()
setCount()

/**
Aside panel functionality
**/
// document.querySelector('.info-button').addEventListener('click', toggleAside)
// document.querySelector('#hide-aside').addEventListener('click', toggleAside)

// function toggleAside(){       document.querySelector('aside').classList.toggle('reveal')
// }
// /**
// Aside Panel end
// */


// /*
//   Task Constructor
//   contains type: task, (future) event, (future) note
//   content: content of task items
//   status: for task(incomplete, complete, (near future migrate/down carat/), (far future migrate/up carat/))
//   source: related html ID
// */
// function Task(type, content, status, source) {
//   this.type = type;
//   this.content = content;
//   this.status = status;
//   this.source = source;
// }
//
//

// /*fires when checkbox is clicked*/
// function checkMe(click){
//   let checkbox = click.currentTarget
//   if(checkbox.checked===false){
//     console.log("I'm not checked");
//     checkbox.parentElement.classList.remove('checked')
//     completeCount.innerText = Number(completeCount.innerText)-1
//   } else {
//     console.log("I'm checked");
//     checkbox.parentElement.classList.add('checked')
//     console.log(`completed tasks: ${completeCount.innerText}`);
//     completeCount.innerText = Number(completeCount.innerText)+1
//   }
// }

// /* Do this later
// ToDoList Constructor
// default starter List
// */
// function ToDoList(starterList = [], listName){
//   this.taskList = [];
//   this.taskCounter -> live counter for created tasks, includes tasks that were deleted
// }
