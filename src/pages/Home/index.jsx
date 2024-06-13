import { useState, useEffect, useRef } from 'react';
import './styles.css';
import RemoveIcon from '../../assets/remove.svg';
import EditIcon from '../../assets/edit.svg';
import api from '../../services/api';
import Modal from '../Modal';

function Home() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  let inputName = useRef();
  let inputEmail = useRef();
  let inputPassword = useRef();

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

    inputName.current.value = '';
    inputEmail.current.value = '';
    inputPassword.current.value = ''
    getUsers();
  }

  async function deleteUsers(id) {
    await api.delete(`usuarios/${ id }`);

    getUsers();
  }
  
  useEffect(() => {
    getUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);  
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);  
    setEditingUser(null);
    getUsers();
  };

  return (
    <div className='container'>
      <form className='home-form'>
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
              <div className='btn-container'>
                <button>
                  <img src={ RemoveIcon } width={32} onClick={() => deleteUsers(user.id)}/>
                </button>
                <button data-modal="abrir">
                  <img src={ EditIcon } width={32} onClick={() => handleEditClick(user)}/>
                </button>
              </div>
            </div>
          );
        })}

      </section>
      {isModalOpen && <Modal user={editingUser} onClose={handleCloseModal} />}
    </div>
  )
}

export default Home;