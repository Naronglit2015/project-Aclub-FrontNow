import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const TableReservationPage = () => {
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');

    if (storedUserId && storedUsername) {
      setUserId(storedUserId);
      setUsername(storedUsername);
    }

    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:8889/auth/tableReser', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');

    try {
      // Check if the selected table is already reserved by another user
      const isTableAlreadyReserved = reservations.some(reservation => reservation.tableNumber === tableNumber && reservation.userId !== userId);

      if (isTableAlreadyReserved) {
        // Show alert if the table is already reserved
        Swal.fire({
          icon: 'error',
          title: 'Table Already Reserved!',
          text: 'This table has already been reserved by another user.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        return; // Exit the function
      }

      // If the table is not already reserved by another user, proceed with reservation
      const response = await axios.post('http://localhost:8889/auth/TableReservation', {
        userId,
        username,
        tableNumber,
        status,
        date
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(response.data);
      // Handle success, maybe show a success message to the user

      // Update reservations after successful reservation
      setReservations([...reservations, { tableNumber, status, date }]);
      // Clear table number after reservation
      setTableNumber('');

      // Show SweetAlert for successful reservation
      Swal.fire({
        icon: 'success',
        title: 'Table Reserved!',
        text: 'Your table reservation has been successful.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error(error);
      // Handle error, maybe show an error message to the user
    }
  };

  const isTableReserved = (tableNum) => {
    return reservations.some(reservation => reservation.tableNumber === tableNum);
  };

  const getStatus = (tableNum) => {
    return isTableReserved(tableNum) ? 'Reserved' : 'Available';
  };

  return (
    <div className="bg-gradient-to-br from-blue-300 to-purple-500 min-h-screen p-8" style={{backgroundImage: 'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")'}}>
      <div className="container mx-auto px-4 py-8 max-w-lg bg-white rounded-md shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Table Reservation</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div>
              <label className="block font-bold text-black mb-2">Table Number:</label>
              <div className="flex flex-wrap gap-2">
                {[...Array(20).keys()].map((num) => {
                  const isCurrentTable = parseInt(tableNumber) === (num + 1);
                  const buttonClasses = `border border-gray-300 rounded-md py-2 px-3 text-gray-800 font-semibold focus:outline-none focus:border-blue-500 ${
                    isTableReserved(num + 1) ? 'bg-red-500 text-white cursor-not-allowed' : isCurrentTable ? 'bg-blue-500 text-white' : ''
                  }`;
                  return (
                    <button
                      key={num + 1}
                      onClick={() => {
                        if (!isTableReserved(num + 1)) {
                          setTableNumber(num + 1);
                        }
                      }}
                      className={buttonClasses}
                      disabled={isTableReserved(num + 1)}
                    >
                      {num + 1} - {getStatus(num + 1)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <label className="block font-bold text-black mb-2">Status:</label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-white font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Table Type</option>
              <option value="vip">VIP</option>
              <option value="normal">Normal</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-black mb-2">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-white font-semibold focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition duration-300">Reserve Table</button>
        </form>

        {/* Render reservations */}
        <div className="mt-8">
          <h2 className="text-3xl font-bold mb-4 text-center text-white">Current Reservations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((reservation, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4">
                <p className="font-bold text-lg text-black">Table Number: {reservation.tableNumber}</p>
                <p className="font-bold text-black">Status: {reservation.status}</p>
                {/* Convert date to a readable format */}
                <p className="font-bold text-black">Date: {new Date(reservation.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableReservationPage;
