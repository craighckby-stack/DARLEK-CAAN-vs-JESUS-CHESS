'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Message } from '@/lib/types';
import { COLORS } from '@/lib/constants';

interface ChatMessageProps {
  message: Message;
}

const COLLAPSE_THRESHOLD = 280;
const PREVIEW_LINES = 3;

function truncateToLines(text: string, maxLines: number): string {
  const lines = text.split('\n');
  if (lines.length <= maxLines) return text;
  return lines.slice(0, maxLines).join('\n');
}

function getPreviewText(text: string): string {
  if (text.length <= COLLAPSE_THRESHOLD) return text;
  const truncated = truncateToLines(text, PREVIEW_LINES);
  return truncated.trimEnd() + '...';
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [expanded, setExpanded] = useState(false);
  const timeStr = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const content = message.content;
  const isLong = content.length > COLLAPSE_THRESHOLD;
  const shouldShow = isLong ? (expanded ? content : getPreviewText(content)) : content;
  const hiddenLines = isLong ? content.split('\n').length - PREVIEW_LINES : 0;

  if (message.role === 'system') {
    return (
      <div className="message-animate flex justify-center py-1">
        <div
          className="px-4 py-2 text-center max-w-md"
          style={{
            background: 'rgba(0, 255, 204, 0.03)',
            border: '1px solid rgba(0, 255, 204, 0.1)',
            borderRadius: '2px',
          }}
        >
          <div
            className="flex items-center justify-center gap-2 mb-1"
            style={{
              fontFamily: 'var(--font-orbitron), sans-serif',
              fontSize: '8px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: COLORS.cyan,
            }}
          >
            <span>&#9673;</span>
            <span>SYSTEM NOTIFICATION</span>
            <span>&#9673;</span>
          </div>
          <p
            style={{
              fontSize: '11px',
              lineHeight: '1.5',
              color: COLORS.cyan,
              fontFamily: 'var(--font-share-tech-mono), monospace',
              whiteSpace: 'pre-wrap',
            }}
          >
            {shouldShow}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-center gap-1 mx-auto mt-1.5 px-2 py-0.5 rounded-sm transition-all"
              style={{
                fontSize: '9px',
                fontFamily: 'var(--font-orbitron), sans-serif',
                letterSpacing: '0.08em',
                color: COLORS.cyan,
                background: 'rgba(0, 255, 204, 0.06)',
                border: '1px solid rgba(0, 255, 204, 0.15)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 255, 204, 0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0, 255, 204, 0.06)'; }}
            >
              {expanded ? (
                <><ChevronDown size={10} /><span>COLLAPSE</span></>
              ) : (
                <><ChevronRight size={10} /><span>EXPAND (+{hiddenLines} lines)</span></>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (message.role === 'caan') {
    return (
      <div className="message-animate flex justify-start">
        <div className="chat-caan rounded-lg p-3 mr-6 sm:mr-12 max-w-[90%] sm:max-w-[85%]">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 pulse-red"
              style={{ background: COLORS.dalekRed }}
            />
            <span
              style={{
                fontFamily: 'var(--font-orbitron), sans-serif',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: COLORS.dalekRed,
              }}
            >
              DARLEK CANN
            </span>
            <span style={{ fontSize: '8px', color: COLORS.textMuted }}>{timeStr}</span>
          </div>
          <p
            style={{
              fontSize: '13px',
              lineHeight: '1.7',
              whiteSpace: 'pre-wrap',
              fontFamily: 'var(--font-share-tech-mono), monospace',
              color: '#e8e8e8',
            }}
          >
            {shouldShow}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mt-2 px-2 py-0.5 rounded-sm transition-all"
              style={{
                fontSize: '9px',
                fontFamily: 'var(--font-orbitron), sans-serif',
                letterSpacing: '0.08em',
                color: COLORS.dalekRed,
                background: 'rgba(255, 32, 32, 0.06)',
                border: '1px solid rgba(255, 32, 32, 0.15)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 32, 32, 0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 32, 32, 0.06)'; }}
            >
              {expanded ? (
                <><ChevronDown size={10} /><span>COLLAPSE</span></>
              ) : (
                <><ChevronRight size={10} /><span>EXPAND (+{hiddenLines} lines)</span></>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // operator messages — also collapsible if long
  const operatorIsLong = content.length > COLLAPSE_THRESHOLD;
  const operatorShow = operatorIsLong ? (expanded ? content : getPreviewText(content)) : content;
  const operatorHidden = operatorIsLong ? content.split('\n').length - PREVIEW_LINES : 0;

  return (
    <div className="message-animate flex justify-end">
      <div className="chat-operator rounded-lg p-3 ml-6 sm:ml-12 max-w-[90%] sm:max-w-[85%]">
        <div className="flex items-center gap-2 mb-2 justify-end">
          <span style={{ fontSize: '8px', color: COLORS.textMuted }}>{timeStr}</span>
          <span
            style={{
              fontFamily: 'var(--font-orbitron), sans-serif',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: COLORS.gold,
            }}
          >
            OPERATOR
          </span>
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: COLORS.gold }}
          />
        </div>
        <p
          style={{
            fontSize: '13px',
            lineHeight: '1.7',
            whiteSpace: 'pre-wrap',
            fontFamily: 'var(--font-share-tech-mono), monospace',
            color: '#ffffff',
          }}
        >
          {operatorShow}
        </p>
        {operatorIsLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-2 ml-auto px-2 py-0.5 rounded-sm transition-all"
            style={{
              fontSize: '9px',
              fontFamily: 'var(--font-orbitron), sans-serif',
              letterSpacing: '0.08em',
              color: COLORS.gold,
              background: 'rgba(255, 170, 0, 0.06)',
              border: '1px solid rgba(255, 170, 0, 0.15)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 170, 0, 0.12)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 170, 0, 0.06)'; }}
          >
            {expanded ? (
              <><ChevronDown size={10} /><span>COLLAPSE</span></>
            ) : (
              <><ChevronRight size={10} /><span>EXPAND (+{operatorHidden} lines)</span></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

