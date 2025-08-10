# Conversational AI Setup

## Configuration Required

Before using the conversational AI feature, you need to:

1. **Get your ElevenLabs Agent ID**:
   - Sign up at https://elevenlabs.io/
   - Create a conversational agent
   - Copy your agent ID

2. **Update the conversation.tsx file**:
   - Replace `'YOUR_AGENT_ID'` with your actual agent ID
   - Optionally replace `'YOUR_CUSTOMER_USER_ID'` with a user identifier

3. **Environment Variables (Optional)**:
   You can also use environment variables:
   ```bash
   NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id_here
   NEXT_PUBLIC_ELEVENLABS_USER_ID=your_user_id_here
   ```

## Features

- Start/Stop conversation with microphone button
- Real-time conversation status
- Visual feedback for listening/speaking states
- Integration with existing symptom checker UI