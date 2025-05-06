// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../styles/Leaderboard.css';

// function Leaderboard() {
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [filter, setFilter] = useState('');
//   const [searchId, setSearchId] = useState('');

//   const fetchLeaderboard = async () => {
//     try {
//       const params = {};
//       if (filter) params.period = filter;
//       if (searchId) params.userId = searchId;
//       const response = await axios.get('/api/leaderboard', { params });
//       setLeaderboard(response.data);
//     } catch (error) {
//       console.error('Error fetching leaderboard:', error);
//       alert('Failed to fetch leaderboard data.');
//     }
//   };

//   const recalculateLeaderboard = async () => {
//     try {
//       await axios.post('/api/recalculate');
//       fetchLeaderboard();
//     } catch (error) {
//       console.error('Error recalculating:', error);
//       alert('Failed to recalculate leaderboard.');
//     }
//   };

//   useEffect(() => {
//     fetchLeaderboard();
//   }, [filter, searchId]);

//   return (
//     <div className="leaderboard-container">
//       <h1 className="leaderboard-title">Leaderboard</h1>
//       <div className="controls">
//         <div className="filter-control">
//           <label htmlFor="filter">Filter:</label>
//           <select
//             id="filter"
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//           >
//             <option value="">All Time</option>
//             <option value="day">Today</option>
//             <option value="month">This Month</option>
//             <option value="year">This Year</option>
//           </select>
//         </div>
//         <div className="search-control">
//           <input
//             type="text"
//             placeholder="Search by User ID"
//             value={searchId}
//             onChange={(e) => setSearchId(e.target.value)}
//           />
//         </div>
//         <button
//           className="recalculate-button"
//           onClick={recalculateLeaderboard}
//         >
//           Recalculate
//         </button>
//       </div>
//       <table className="leaderboard-table">
//         <thead>
//           <tr>
//             <th>Rank</th>
//             <th>User ID</th>
//             <th>Full Name</th>
//             <th>Total Points</th>
//           </tr>
//         </thead>
//         <tbody>
//           {leaderboard.length === 0 ? (
//             <tr>
//               <td colSpan="4" className="no-data">No data available</td>
//             </tr>
//           ) : (
//             leaderboard.map((user) => (
//               <tr key={user.user_id}>
//                 <td>{user.rank}</td>
//                 <td>{user.user_id}</td>
//                 <td>{user.full_name}</td>
//                 <td>{user.total_points}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default Leaderboard;

import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchId, setSearchId] = useState('');

  const fetchLeaderboard = async () => {
    try {
      const params = {};
      if (filter) params.period = filter;
      if (searchId) params.userId = searchId;
      const response = await axios.get('http://localhost:3001/api/leaderboard', { params });
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      alert('Failed to fetch leaderboard data.');
    }
  };

  const recalculateLeaderboard = async () => {
    try {
      await axios.post('http://localhost:3001/api/recalculate');
      fetchLeaderboard();
    } catch (error) {
      console.error('Error recalculating:', error);
      alert('Failed to recalculate leaderboard.');
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [filter, searchId]);

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Leaderboard</h1>
      <div className="controls">
        <div className="filter-control">
          <label htmlFor="filter">Filter:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Time</option>
            <option value="day">Today</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div className="search-control">
          <input
            type="text"
            placeholder="Search by User ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>
        <button
          className="recalculate-button"
          onClick={recalculateLeaderboard}
        >
          Recalculate
        </button>
      </div>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>User ID</th>
            <th>Full Name</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-data">No data available</td>
            </tr>
          ) : (
            leaderboard.map((user) => (
              <tr key={user.user_id}>
                <td>{user.rank}</td>
                <td>{user.user_id}</td>
                <td>{user.full_name}</td>
                <td>{user.total_points}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;