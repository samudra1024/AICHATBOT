import Navigation from '../models/Navigation.js';

// Get directions to department/room
export const getDirections = async (req, res) => {
  try {
    const { department, roomNumber } = req.query;

    let searchCriteria = { active: true };

    if (department) {
      searchCriteria.department = { $regex: department, $options: 'i' };
    }

    if (roomNumber) {
      searchCriteria.roomNumber = roomNumber;
    }

    const locations = await Navigation.find(searchCriteria);

    if (locations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.status(200).json({
      success: true,
      locations
    });

  } catch (error) {
    console.error('Get directions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching directions'
    });
  }
};

// Get all floors and departments
export const getFloorMap = async (req, res) => {
  try {
    const floorMap = await Navigation.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: '$floor',
          departments: {
            $push: {
              department: '$department',
              roomNumber: '$roomNumber',
              facilities: '$facilities',
              wheelchairAccessible: '$wheelchairAccessible'
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      floorMap
    });

  } catch (error) {
    console.error('Get floor map error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching floor map'
    });
  }
};

// Search locations
export const searchLocations = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const locations = await Navigation.find({
      active: true,
      $or: [
        { department: { $regex: query, $options: 'i' } },
        { roomNumber: { $regex: query, $options: 'i' } },
        { landmarks: { $in: [new RegExp(query, 'i')] } },
        { facilities: { $in: [new RegExp(query, 'i')] } }
      ]
    });

    res.status(200).json({
      success: true,
      locations
    });

  } catch (error) {
    console.error('Search locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching locations'
    });
  }
};