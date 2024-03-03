import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const guestNav = [
  { to: '/', text: 'Login' },
  { to: '/register', text: 'Register' },
];

const userNav = [
  { to: '/', text: 'Home' },
  { to: '/products', text: 'Products' },
  { to: '/table-reservations', text: 'Table Reservations' },
  { to: '/confirm', text: 'OrderPage' },
];
const AdminNav = [
  { to: '/products', text: 'Products' },
  { to: '/table-reservations', text: 'Table Reservations' },
  { to: '/confirm', text: 'OrderPage' },
  { to: '/Adproduct', text: 'AddProductForm' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const finalNav = user?.id ? ( user.role === 'ADMIN' ? AdminNav : userNav ) : guestNav;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-gray-900 p-4 shadow-lg border-b-4 border-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {user?.id && user.avatar && (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-12 h-12 rounded-full mr-4 shadow-md"
            />
          )}
          <span className="font-bold text-white text-lg mr-4">
            
          <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKG3NYPSNCVwyicMNQPkiIy5FsXp5RYDQp9w&usqp=CAU"
                  alt="Profile"
                  className="w-10 h-8 rounded-full ml-5"
                />Hello, {user?.id ? (
              <>
              
                <span className="text-gray-400">{user.username}</span>
                
              </>
            ) : (
              'Guest'
            )}
          </span>
          <ul className="flex space-x-4">
            {finalNav.map((el, index) => (
              <li key={index}>
                <Link
                   to={el.to}
                   className="font-bold text-white transition duration-300 py-2 px-4 rounded-lg bg-gray-800 shadow-md hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                   style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
                >
                  {el.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {user?.id && (
          <button
            onClick={handleLogout}
            className="bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded-lg transition duration-300 shadow-md"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
