// routes/api.js

const express = require('express');
const router = express.Router();
const UserData = require('../models/userdata'); // Corrected path and case

// POST route to collect user data and save it to MongoDB
router.post('/collect-data', async (req, res) => {
  try {
    // Log the incoming request body for debugging
    console.log('Incoming request body:', req.body);

    // Destructure the incoming request body to get the user interaction data
    const {
      userId = 'anonymous-user', // Added userId
      avgCursorSpeed = 0,
      cursorAcceleration = 0,
      pathDeviation = 0,
      idleTime = 0,
      jitter = 0,
      clickPattern = 0,
      typingSpeed = 0,
      keyPressDuration = 0,
      keyTransitionTime = 0,
      errorRate = 0,
      sessionDuration = 0,
      pageNavigationPattern = [],
      averageDwellTime = 0,
      scrollBehavior = 0,
    } = req.body;

    // Log types of each field for debugging
    console.log('Types of received fields:');
    console.log('userId:', typeof userId);
    console.log('avgCursorSpeed:', typeof avgCursorSpeed);
    console.log('cursorAcceleration:', typeof cursorAcceleration);
    console.log('pathDeviation:', typeof pathDeviation);
    console.log('idleTime:', typeof idleTime);
    console.log('jitter:', typeof jitter);
    console.log('clickPattern:', typeof clickPattern);
    console.log('typingSpeed:', typeof typingSpeed);
    console.log('keyPressDuration:', typeof keyPressDuration);
    console.log('keyTransitionTime:', typeof keyTransitionTime);
    console.log('errorRate:', typeof errorRate);
    console.log('sessionDuration:', typeof sessionDuration);
    console.log('pageNavigationPattern:', typeof pageNavigationPattern);
    console.log('averageDwellTime:', typeof averageDwellTime);
    console.log('scrollBehavior:', typeof scrollBehavior);

    // Validate required fields
    const missingFields = [];
    if (typeof userId !== 'string') missingFields.push('userId');
    if (typeof avgCursorSpeed !== 'number' || isNaN(avgCursorSpeed)) missingFields.push('avgCursorSpeed');
    if (typeof cursorAcceleration !== 'number' || isNaN(cursorAcceleration)) missingFields.push('cursorAcceleration');
    if (typeof pathDeviation !== 'number' || isNaN(pathDeviation)) missingFields.push('pathDeviation');
    if (typeof idleTime !== 'number' || isNaN(idleTime)) missingFields.push('idleTime');
    if (typeof jitter !== 'number' || isNaN(jitter)) missingFields.push('jitter');

    if (missingFields.length > 0) {
      console.error('Validation failed: Missing or invalid fields:', missingFields);
      return res.status(400).json({
        message: 'Validation error: Missing or invalid data',
        missingFields,
      });
    }

    // Create a new UserData document with the received data
    const newUserData = new UserData({
      userId, // Include userId
      avgCursorSpeed,
      cursorAcceleration,
      pathDeviation,
      idleTime,
      jitter,
      clickPattern,
      typingSpeed,
      keyPressDuration,
      keyTransitionTime,
      errorRate,
      sessionDuration,
      pageNavigationPattern,
      averageDwellTime,
      scrollBehavior,
    });

    // Save the new document to MongoDB
    await newUserData.save();

    // Respond with a success message
    console.log('Data saved successfully:', newUserData);
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({
      message: 'Server error: Unable to save data',
      error: error.message,
    });
  }
});

module.exports = router;
