import Chat from '../models/Chat.js';
import { callGemma, detectLanguage } from '../utils/gemmaService.js';
import { detectEmergency, getEmergencyResponse } from '../utils/emergencyDetector.js';

// Send message and get AI response
export const sendMessage = async (req, res) => {
  try {
    const { message, language } = req.body;
    const userId = req.userId;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Detect language if not provided
    const detectedLanguage = language || detectLanguage(message);

    // Check for emergency
    if (detectEmergency(message)) {
      const emergencyMsg = getEmergencyResponse(detectedLanguage);

      // Save to chat history
      let chat = await Chat.findOne({ userId });
      if (!chat) {
        chat = new Chat({ userId, messages: [], language: detectedLanguage });
      }

      chat.messages.push(
        { role: 'user', content: message },
        { role: 'assistant', content: emergencyMsg }
      );
      chat.language = detectedLanguage;
      chat.lastUpdated = new Date();
      await chat.save();

      return res.status(200).json({
        success: true,
        response: emergencyMsg,
        isEmergency: true,
        language: detectedLanguage
      });
    }

    // Get chat history for context
    let chat = await Chat.findOne({ userId });
    if (!chat) {
      chat = new Chat({ userId, messages: [], language: detectedLanguage });
    }

    // Call Gemma-3 AI
    const aiResponse = await callGemma(message, detectedLanguage, chat.messages);

    // Save conversation
    chat.messages.push(
      { role: 'user', content: message },
      { role: 'assistant', content: aiResponse.response }
    );
    chat.language = detectedLanguage;
    chat.lastUpdated = new Date();
    await chat.save();

    res.status(200).json({
      success: true,
      response: aiResponse.response,
      language: detectedLanguage,
      isEmergency: false
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing your message'
    });
  }
};

// Get chat history
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const chat = await Chat.findOne({ userId });

    if (!chat) {
      return res.status(200).json({
        success: true,
        messages: [],
        language: 'English'
      });
    }

    res.status(200).json({
      success: true,
      messages: chat.messages,
      language: chat.language
    });

  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chat history'
    });
  }
};

// Clear chat history
export const clearChat = async (req, res) => {
  try {
    const userId = req.userId;

    await Chat.findOneAndUpdate(
      { userId },
      { messages: [], lastUpdated: new Date() },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Chat history cleared successfully'
    });

  } catch (error) {
    console.error('Clear chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing chat history'
    });
  }
};

// Update language preference
export const updateLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    const userId = req.userId;

    const validLanguages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Kannada'];

    if (!validLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid language'
      });
    }

    await Chat.findOneAndUpdate(
      { userId },
      { language, lastUpdated: new Date() },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Language updated successfully',
      language
    });

  } catch (error) {
    console.error('Update language error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating language'
    });
  }
};
