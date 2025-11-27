import Medicine from '../models/Medicine.js';

// Search medicines
export const searchMedicines = async (req, res) => {
  try {
    const { query, category, prescription } = req.query;

    let searchCriteria = { active: true };

    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: 'i' } },
        { genericName: { $regex: query, $options: 'i' } }
      ];
    }

    if (category) {
      searchCriteria.category = category;
    }

    if (prescription !== undefined) {
      searchCriteria.prescription = prescription === 'true';
    }

    const medicines = await Medicine.find(searchCriteria)
      .sort({ name: 1 })
      .limit(50);

    res.status(200).json({
      success: true,
      medicines
    });

  } catch (error) {
    console.error('Search medicines error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching medicines'
    });
  }
};

// Check medicine availability
export const checkAvailability = async (req, res) => {
  try {
    const { medicineId } = req.params;

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    res.status(200).json({
      success: true,
      medicine: {
        name: medicine.name,
        genericName: medicine.genericName,
        stock: medicine.stock,
        available: medicine.stock > 0,
        price: medicine.price,
        homeDelivery: medicine.homeDelivery,
        deliveryTime: medicine.deliveryTime,
        prescription: medicine.prescription
      }
    });

  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking availability'
    });
  }
};

// Get medicine categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Medicine.distinct('category', { active: true });

    res.status(200).json({
      success: true,
      categories: categories.sort()
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
};