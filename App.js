import React, { useState } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SupportAgentIcon from '@mui/icons-material/SupportAgent'; // Chatbot Icon
import stringSimilarity from 'string-similarity'; // Fuzzy matching
import dataset from './formatted_dataset.json';

const App = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);

  const extractKeywords = (text) => {
    const commonWords = ['how', 'where', 'what', 'can', 'i', 'the', 'a', 'an', 'is', 'of', 'to'];
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => !commonWords.includes(word));
  };

  const calculateSimilarity = (query, datasetQuery) => {
    return stringSimilarity.compareTwoStrings(query.toLowerCase(), datasetQuery.toLowerCase());
  };

  const handleSend = async () => {
    if (query.trim()) {
      setMessages([...messages, { sender: 'user', text: query }]);

      let bestMatch = null;
      let highestSimilarity = 0;

      for (let i = 0; i < dataset.length; i++) {
        const datasetKeywords = extractKeywords(dataset[i].query);
        const queryKeywords = extractKeywords(query);

        const keywordMatchCount = queryKeywords.filter((word) =>
          datasetKeywords.includes(word)
        ).length;

        const similarityScore = calculateSimilarity(query, dataset[i].query);
        const combinedScore = similarityScore + keywordMatchCount * 0.2;

        if (combinedScore > highestSimilarity) {
          highestSimilarity = combinedScore;
          bestMatch = dataset[i].response;
        }
      }

      if (highestSimilarity > 0.5) {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: bestMatch },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'Can you please rephrase your query?' },
        ]);
      }

      setQuery('');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        bgcolor: '#edf7f0',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: '100%', sm: '20%' },  // Responsive width for mobile
          bgcolor: '#388E3C',  // Normal Green Color
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          gap: 2,
          textAlign: 'center',
          borderRadius: 2,
          boxShadow: 2,
          animation: 'sidebarFadeIn 2s ease-out', // Simple fade-in animation
          '@keyframes sidebarFadeIn': {
            '0%': { opacity: 0, transform: 'translateY(20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Avatar sx={{ bgcolor: '#2e7d32', width: 60, height: 60 }}>
          <SupportAgentIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography
          sx={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            mt: 2,
          }}
        >
          DUET Chatbot
        </Typography>
        <Typography sx={{ fontSize: '1rem', mt: 1 }}>
          Connecting students with accurate and real-time transport information.
        </Typography>
        <Typography sx={{ fontSize: '0.85rem', mt: 2 }}>
          Powered by AI and GPS Integration
        </Typography>
      </Box>

      {/* Chat Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          border: '3px solid',
          borderImage: 'linear-gradient(to right, #32a852, #32a8a8, #32a852) 1',
          borderRadius: '8px',
          overflow: 'hidden',
          m: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: '#32a852',
            color: 'white',
            textAlign: 'center',
            p: 2,
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          DUET Chatbot
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {messages.map((msg, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                maxWidth: '75%',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                bgcolor: msg.sender === 'user' ? '#32a852' : '#d3d3d3',
                color: msg.sender === 'user' ? 'white' : 'black',
                borderRadius: 2,
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                boxShadow: msg.sender === 'bot' ? '0px 0px 10px rgba(144, 238, 144, 0.7)' : 'none',
              }}
            >
              {msg.sender === 'bot' && (
                <Avatar sx={{ bgcolor: '#228B22' }}>
                  <SupportAgentIcon />
                </Avatar>
              )}
              <Typography>{msg.text}</Typography>
            </Paper>
          ))}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: 'flex',
            p: 2,
            borderTop: 1,
            borderColor: 'grey.300',
            bgcolor: 'white',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Type your message..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            sx={{
              mr: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              },
            }}
          />
          <IconButton color="success" onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
