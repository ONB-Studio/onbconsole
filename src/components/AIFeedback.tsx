// src/components/AIFeedback.tsx
"use client";
import ReactMarkdown from 'react-markdown';
import styles from '@/app/page.module.css';

interface AIFeedbackProps {
  feedback: string;
  isLoading: boolean;
}

export default function AIFeedback({ feedback, isLoading }: AIFeedbackProps) {
  if (isLoading) {
    return <div className={styles.aiFeedback}>Loading AI feedback...</div>;
  }

  if (!feedback) {
    return null;
  }

  return (
    <div className={styles.aiFeedback}>
      <h3>AI Analysis</h3>
      <ReactMarkdown>{feedback}</ReactMarkdown>
    </div>
  );
}
