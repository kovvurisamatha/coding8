const express = require('express')
const app = express()
app.use(express.json())
const path = require('path')
const dbpath = path.join(__dirname, 'todoApplication.db')
let db = null
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const initializeserver = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`dberror:${e.message}`)
    process.exit(1)
  }
}
initializeserver()
//api1
const havingprioritypropertyandstatusproperty = requestquery => {
  return (
    requestquery.priority !== undefined && requestquery.status !== undefined
  )
}
const havingpriorityproperty = requestquery => {
  return requestquery.priority !== undefined
}
const havingstatusproperty = requestquery => {
  return requestquery.status !== undefined
}
app.get('/todos', async (request, response) => {
  let data = null
  let todoquery = ''
  const {search_q = '', priority, status} = request.query
  switch (true) {
    case havingprioritypropertyandstatusproperty(request.query):
      todoquery = `select * from todo
    where todo like '%${search_q}%' and 
    priority="${priority}" and status='${status}'`
      break
    case havingpriorityproperty(request.query):
      todoquery = `select * from todo 
    where todo='%${search_q}%' and priority='${priority}'`
      break
    case havingstatusproperty(request.query):
      todoquery = `select * from todo where todo='%${search_q}%'
    and status='${status}'`
      break
    default:
      todoquery = `select * from todo where todo like '%${search_q}%'`
  }
  data = await db.all(todoquery)
  response.send(data)
})
//api2
app.get('/todos/:todoId', async (request, response) => {
  const {todoId} = request.params
  const gettodoquery = `select * from todo where id=${todoId}`
  const gettodoresponse = await db.get(gettodoquery)
  response.send(gettodoresponse)
})
//api3
app.post('/todos/', async (request, response) => {
  const tododetails = request.body
  const {id, todo, priority, status} = tododetails
  const addtodo = `insert into todo
  (id,todo,priority,status)
  values(${id},'${todo}','${priority}','${status}')`
  const addtodoresponse = await db.run(addtodo)

  response.send('Todo Successfully Added')
})
//api4
app.("/todos/:todoId/",async(request,response)=>{
  
})
//api5
app.delete('/todos/:todoId', async (request, response) => {
  const {todoId} = request.params
  const delectquery = `delete from todo where id=${todoId}`
  const deleteresponse = await db.run(delectquery)
  response.send('Todo Deleted')
})
