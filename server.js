// Backend: Node.js server with Socket.IO
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the public directory
app.use(express.static('public'));

// Store map state (points with statuses)
let mapState = [];

// Predefined boss points
const bossPoints = [
      { x: 117, y: 74, radius: 30 },
      { x: 217, y: 71, radius: 30 },
      { x: 284, y: 61, radius: 30 },
      { x: 223, y: 132, radius: 30 },
      { x: 342, y: 223, radius: 30 },
	  
      { x: 543, y: 113, radius: 30 },
      { x: 624, y: 149, radius: 30 },
      { x: 687, y: 98, radius: 30 },
      { x: 743, y: 51, radius: 30 },
	  
      { x: 143, y: 322, radius: 25 },
      { x: 152, y: 379, radius: 25 },
      { x: 103, y: 458, radius: 25 },
      { x: 161, y: 457, radius: 25 },
      { x: 278, y: 366, radius: 25 },
      { x: 283, y: 506, radius: 25 },
	  
	  
      { x: 492, y: 271, radius: 30 },
      { x: 716, y: 271, radius: 30 },
      { x: 547, y: 417, radius: 30 },
      { x: 558, y: 486, radius: 30 },
      { x: 621, y: 416, radius: 30 }
    ];

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send current map state to newly connected users
  socket.emit('initialize', mapState);

  // Handle marker updates
  socket.on('updateMarker', (marker) => {
    // Update or add the marker in the map state
    const existingMarker = mapState.find(m => m.x === marker.x && m.y === marker.y);
    if (existingMarker) {
      if (marker.status === 'clear') {
        mapState = mapState.filter(m => m !== existingMarker);
      } else {
        existingMarker.status = marker.status;
      }
    } else if (marker.status !== 'clear') {
      mapState.push(marker);
    }

    // Broadcast the update to all clients
    io.emit('updateMarker', marker);
  });

  // Handle clear all points request
  socket.on('clearAllMarkers', () => {
    mapState = [];
    io.emit('clearAllMarkers');
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});