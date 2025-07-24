import { useState , useEffect} from 'react'
import personService from './services/persons'

const Notification = ({ notification }) => {
  const notificationStyle = {
    color: notification.type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 16,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (notification.message === null) {
    return null
  }
  return (
    <div style={notificationStyle} className="error">{notification.message}</div>
  )

}

const Remove = ({id, setPersons, name, setNotification }) => {
  const handleRemove = () => {
    if (window.confirm(`Delete ${name}?`)) {
    personService
    .remove(id)
    .then(() => {
      setPersons(persons => persons.filter(person => person.id !== id))
      setNotification({message: `Deleted ${name}`, type: 'success'})
      setTimeout(() => {
      setNotification({message: null, type: null})}, 3000)
    }
  )}}
  return(
    <button onClick={handleRemove}>delete</button>
  )
}

const Filter = ({filter, setNewFilter}) => {
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }

  return (
  <div>filter shown with <input value={filter} onChange={handleFilterChange} /></div>
  )
}

const Persons = ({persons, setPersons, filter, setNotification}) => {
  return(
  <>
  {persons.map(person => 
    <Individual key={person.id} person={person} filter={filter} setPersons={setPersons} setNotification={setNotification}/>)}
  </>
  )
}

const Individual = ({person, setPersons, filter, setNotification}) => {
  if (person.name.toLowerCase().includes(filter.toLowerCase())) {
  return (
    <>
    <p>
    {person.name} {person.number} <Remove id={person.id} setPersons={setPersons} name={person.name} setNotification={setNotification}></Remove>
    </p>
    </>
  )
  }
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notification, setNotification] = useState({message: null, type: null})

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    if (persons.some(person => person.name === newName)) {
      const person = persons.find(person => person.name===newName)
      const id = person.id
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
        .update(id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
          setNotification({message: `Updated ${newName}'s number`, type: 'success'})
          setNewName('')
          setNewNumber('')
          setTimeout(() => {
          setNotification({message: null, type: null})}, 3000)
        })
        .catch(error => {
        setNotification({ 
          message: `Information of ${newName} has already been removed from server`,
          type: 'error'
        })
        setTimeout(() => {
          setNotification({message: null, type: null})
        }, 3000)
      })
    }
    }
    else {
      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')})
        setNotification({message: `Added ${newName}`, type: 'success'})
        setTimeout(() => {
        setNotification({message: null, type: null})}, 3000)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification}></Notification>
      <Filter filter={newFilter} setNewFilter={setNewFilter}></Filter>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={handleNameChange} /></div>
        <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
        <div>

          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={newFilter} setPersons={setPersons} setNotification={setNotification}></Persons>
    </div>
  )
}

export default App
