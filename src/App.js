// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
// import React, { useState, useEffect } from 'react';
// // import axios, { axios } from 'axios';
// import axios from 'axios';
// import FilterBar from './components/FilterBar';
// import Leaderboard from './components/Leaderboard';

// function App() {
//   const [data, setData] = useState([]);
//   const [filter, setFilter] = useState('');
//   const [search, setSearch] = useState('');

//   const fetchData = async () => {
//     const res = await axios.get('http://localhost:3000/api/leaderboard', {
//       params: { filter, search }
//     });
//     setData(res.data);
//   };

//   useEffect(() => {
//     fetchData();
//   }, [filter, search]);

//   const handleRecalculate = async () => {
//     await axios.post('http://localhost:3000/api/leaderboard/recalculate');
//     fetchData();
//   };

//   return (
//     <div>
//  <Leaderboard data={data} />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import Leaderboard from './components/Leaderboard';
import './styles/Leaderboard.css';

function App() {
  return (
    <div className="app-container">
      <Leaderboard />
    </div>
  );
}

export default App;