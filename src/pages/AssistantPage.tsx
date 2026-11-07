import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { AlertBanner } from '../components/common/AlertBanner';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  chips?: string[];
}

export const AssistantPage: React.FC = () => {
  const { state, radarItems } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello ${state.profile.fullName || 'Scholar'}! I am your GRANTLY Opportunity Assistant. I provide deterministic guidance on eligibility rules, required documentation, personal statement brainstorming, and deadline strategies tailored to your profile.`,
      timestamp: 'Just now',
      chips: [
        'Check my high-priority opportunities',
        'Brainstorm personal statement ideas',
        'What documents am I missing?',
        'How do I avoid common scholarship mistakes?'
      ]
    }
  ]);

  const quickPrompts = [
    'Check my high-priority opportunities',
    'Brainstorm personal statement ideas',
    'What documents am I missing?',
    'How do I avoid common scholarship mistakes?',
    'Review my STEM fellowship readiness'
  ];

  // Deterministic local response generator
  const generateResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('priority') || q.includes('radar') || q.includes('recommend')) {
      const topItems = radarItems.slice(0, 3);
      return `Based on your Opportunity Radar, your top 3 prioritized opportunities right now are:\n\n1. **${topItems[0]?.scholarship.title}** (${topItems[0]?.priorityScore}/100 priority score) — Award: $${topItems[0]?.scholarship.awardAmount.toLocaleString()}, Deadline: ${topItems[0]?.scholarship.applicationDeadline} (${topItems[0]?.daysRemaining} days left). Recommended Action: ${topItems[0]?.actionRequired}.\n\n2. **${topItems[1]?.scholarship.title}** (${topItems[1]?.priorityScore}/100) — Award: $${topItems[1]?.scholarship.awardAmount.toLocaleString()}.\n\n3. **${topItems[2]?.scholarship.title}** (${topItems[2]?.priorityScore}/100) — Award: $${topItems[2]?.scholarship.awardAmount.toLocaleString()}.`;
    }

    if (q.includes('statement') || q.includes('essay') || q.includes('brainstorm')) {
      const field = state.profile.fieldOfStudy || 'your major';
      const inst = state.profile.institution || 'university';
      return `Here is a tailored personal statement blueprint for ${state.profile.fullName || 'your profile'} in ${field}:\n\n• **Core Narrative Hook:** Connect your lived background (${state.profile.firstGenerationStudent ? 'as a first-generation college student ' : ''}at ${inst}) to the real-world problems you are addressing in ${field}.\n• **Academic Distinction:** Highlight specific coursework or research projects where you achieved top marks (current GPA: ${state.profile.gpa.toFixed(2)}).\n• **Financial Leverage:** Explain clearly how scholarship funding directly relieves tuition burdens, allowing 15+ hours weekly toward academic research and community impact.\n• **Future Trajectory:** Conclude with your concrete post-graduation goals for ${state.profile.intendedSpecialization || 'leadership in your discipline'}.`;
    }

    if (q.includes('document') || q.includes('missing') || q.includes('vault')) {
      const verifiedDocs = state.documents.filter(d => d.status === 'Verified').map(d => d.title);
      const draftDocs = state.documents.filter(d => d.status === 'Draft').map(d => d.title);

      return `Your Document Vault status:\n\n• **Verified Documents (${verifiedDocs.length}):** ${verifiedDocs.join(', ') || 'None'}\n• **Draft / Pending Work (${draftDocs.length}):** ${draftDocs.join(', ') || 'None'}\n\n**Recommendation:** Complete the final draft of your Personal Statement in the Document Vault to achieve 100% submission readiness for the Future Tech and Vanguard scholarships.`;
    }

    if (q.includes('mistake') || q.includes('pitfall') || q.includes('avoid')) {
      return `Four common scholarship mistakes students make and how to avoid them:\n\n1. **Submitting Generic Statements:** Reusing the exact same essay without mentioning the provider's specific philanthropic mission.\n2. **Submitting Low-Resolution Screenshots:** Always submit official registrar PDFs, not uncertified portal screenshots.\n3. **Waiting Until the Final 24 Hours:** Technical glitches and portal traffic surges frequently cause missed deadlines.\n4. **Overlooking Word Count & Formatting Rules:** Stick strictly within 10% of requested lengths and use clear section headings.`;
    }

    if (q.includes('stem') || q.includes('tech')) {
      return `For STEM and tech-focused fellowships:\n\nYour recorded GPA is **${state.profile.gpa.toFixed(2)}** in **${state.profile.fieldOfStudy}**, which qualifies you for competitive programs including the *Future Tech & AI Leadership Scholarship* and *Vanguard Women in STEM Excellence Fellowship*. Ensure your technical portfolio / GitHub repository links are embedded directly into your CV.`;
    }

    return `Thank you for asking! With your current GPA of ${state.profile.gpa.toFixed(2)} and ${state.bookmarkedScholarshipIds.length} saved opportunities, you are in a strong position. You can explore matching scholarships in the Discover tab, track deadlines in the Calendar, or review your funding scenarios in Funding Insights.`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const botReply: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'assistant',
      text: generateResponse(text),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg, botReply]);
    setInputMessage('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
          <Sparkles size={22} color="var(--primary)" />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
            Opportunity Assistant
          </h1>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Context-aware guidance on scholarship eligibility, personal statements, documentation, and deadlines.
        </p>
      </div>

      {/* Honest Local Demo Notice */}
      <AlertBanner type="info" title="Built-in Deterministic Demo Engine">
        <span>
          This assistant utilizes a context-aware local intelligence engine based on your student profile and scholarship rules. It does not make external paid API calls or fabricate false acceptance claims.
        </span>
      </AlertBanner>

      {/* Chat Area Container */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '560px',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Messages Scroll Area */}
        <div
          style={{
            flex: 1,
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  maxWidth: '82%',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: msg.sender === 'user' ? 'var(--secondary)' : 'var(--primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  {msg.sender === 'user' ? 'You' : <Sparkles size={16} />}
                </div>

                <div
                  style={{
                    padding: '0.9rem 1.15rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'var(--surface-subtle)',
                    color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--border)',
                    fontSize: '0.9rem',
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {msg.text}
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-subtle)',
                  marginTop: '0.3rem',
                  paddingLeft: msg.sender === 'user' ? '0' : '42px',
                  paddingRight: msg.sender === 'user' ? '42px' : '0'
                }}
              >
                {msg.timestamp}
              </span>

              {/* Action Chips */}
              {msg.chips && msg.chips.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.45rem',
                    marginTop: '0.75rem',
                    paddingLeft: '42px'
                  }}
                >
                  {msg.chips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip)}
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--primary)',
                        backgroundColor: 'var(--primary-soft)',
                        border: '1px solid rgba(23, 76, 58, 0.15)',
                        borderRadius: 'var(--radius-full)',
                        padding: '0.35rem 0.75rem',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Suggested Prompts Bar */}
        <div
          style={{
            padding: '0.65rem 1.25rem',
            backgroundColor: 'var(--surface-subtle)',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 700, whiteSpace: 'nowrap' }}>
            Quick Prompts:
          </span>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(p)}
              style={{
                fontSize: '0.78rem',
                padding: '0.25rem 0.65rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap'
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          style={{
            display: 'flex',
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--surface)',
            borderTop: '1px solid var(--border)',
            gap: '0.75rem'
          }}
        >
          <input
            type="text"
            className="input-control"
            placeholder="Ask anything about scholarship requirements, statements, or eligibility..."
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
          />
          <Button variant="primary" type="submit" icon={<Send size={16} />}>
            Ask Assistant
          </Button>
        </form>
      </div>
    </div>
  );
};
