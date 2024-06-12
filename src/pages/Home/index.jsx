import { useState, useEffect, useRef } from 'react';
import './styles.css';
import RemoveIcon from '../../assets/remove.svg';
import api from '../../services/api';

function Home() {
  const [users, setUsers] = useState([]);

  const inputName = useRef();
  const inputEmail = useRef();
  const inputPassword = useRef();

  async function getUsers() {
    const usersFromApi = await api.get('usuarios');
    
    setUsers(usersFromApi.data);
  }

  async function createUsers() {
    await api.post('usuarios', {
      name: inputName.current.value,
      email: inputEmail.current.value,
      password: inputPassword.current.value
    })

    getUsers();
  }

  async function deleteUsers(id) {
    await api.delete(`usuarios/${ id }`);

    getUsers();
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className='container'>
      <form>
        <h1>Cadastro de usuários</h1>
        <input name='nome' type='text' placeholder='Digite seu nome' ref={inputName} required/>
        <input name='email' type='email' placeholder='Digite seu email' ref={inputEmail} required/>
        <input name='senha' type='password' placeholder='Digite sua senha' ref={inputPassword} required/>

        <button onClick={createUsers} className='btn' type='button'>Cadastrar</button>
      </form>

      <section className='card-section'>
        {users.map((user) => {
          return (
            <div key={ user.id } className='card'>
              <div>
                <p>Nome: <span>{ user.name }</span></p>
                <p>E-mail: <span>{ user.email }</span></p>
              </div>
              <button>
                <img src={ RemoveIcon } width={32} onClick={() => deleteUsers(user.id)}/>
              </button>
            </div>
          );
        })}

      </section>
    </div>
  )
}

export default Home;