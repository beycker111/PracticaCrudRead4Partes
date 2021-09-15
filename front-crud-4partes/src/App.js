//import React, { createContext, useContext, useReducer } from 'react';
import React, { useContext, useReducer, useEffect, useRef, useState, createContext } from 'react';


const HOST_API = "http://localhost:8080/api"

const initialState = {
  list: []
}

const Store = createContext(initialState)

const Form = () => {

  const formRef = useRef(null);
  const { dispatch } = useContext(Store); //Nos da un estado externo
  const [state, setState] = useState({}); //Nos da un estado interno

  const onAdd = (event) => {
    event.preventDefault();

    const request = {
      name: state.name,
      id: null,
      isCompleted: false
    };


    fetch(HOST_API + "/todo", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((todo) => {
        dispatch({ type: "add-item", item: todo });
        setState({ name: "" });
        formRef.current.reset();
      });
  }


  return <form ref={formRef}>
    <input
      type="text"
      name="name"
      placeholder="¿Qué piensas hacer hoy?"
      onChange={(event) => {
        setState({ ...state, name: event.target.value })
      }}  ></input>
    <button onClick={onAdd}>Agregar</button>
  </form>
}

const List = () => {

  const { dispatch, state} = useContext(Store);

  useEffect(() => {
    fetch(HOST_API + "/todos")
      .then(response => response.json())
      .then((list) => {
        dispatch({ type: "update-list", list })
      })
  }, [state.list.lenght, dispatch]);

  return <div>
    <table >
      <thead>
        <tr>
          <td>ID</td>
          <td>Nombre</td>
          <td>¿Completado?</td>
        </tr>
      </thead>
      <tbody>
        {state.list.map((todo) => {
          return <tr key={todo.id}>
            <td>{todo.id}</td>
            <td>{todo.name}</td>
            <td>{todo.isCompleted}</td>
          </tr>
        })}
      </tbody>
    </table>
  </div>
}

function reducer(state, action) {
  switch (action.type) {
    case 'update-list':
      return { ...state, list: action.list }
    case 'add-item':
      const newList = state.list;
      newList.push(action.item);
      return { ...state, list: newList }
    default:
      return state;
  }
}

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  //dispatch nos permite notificar a reducer que cambios quiere que pase al sistema orintado a una accion
  return <Store.Provider value={{ state, dispatch }}>
    {children}
  </Store.Provider>

}

function App() {
  return (
    <StoreProvider>
      <Form />
      <List />
    </StoreProvider>
  );
}

export default App;
