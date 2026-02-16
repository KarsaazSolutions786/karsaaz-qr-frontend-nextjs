"use client";

import CustomCodeBlock from './CustomCodeBlock';
import { Block } from '../types';

/**
 * CustomCodeBlock Demo
 * Demonstrates the usage of CustomCodeBlock with various code examples
 */

export function CustomCodeBlockExamples() {
  // Example 1: Simple HTML with CSS
  const htmlExampleBlock: Block = {
    id: 'demo-html-css',
    type: 'custom-code',
    title: 'HTML + CSS Example',
    content: {
      html: `
        <div class="demo-card">
          <h2>Welcome to Custom Code!</h2>
          <p>This is a demonstration of HTML and CSS capabilities.</p>
          <button onclick="alert('Hello!')">Click Me</button>
        </div>
      `,
      css: `
        .demo-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          max-width: 400px;
          margin: 0 auto;
        }
        .demo-card h2 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        .demo-card button {
          background: white;
          color: #667eea;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 1rem;
        }
      `,
      javascript: '',
      codeType: 'combined',
      showPreview: true,
      autoRun: true,
      enableHtml: true,
      enableCss: true,
      enableJs: false,
      securityWarnings: true,
      sandboxMode: true
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    design: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    }
  };

  // Example 2: JavaScript Animation
  const jsExampleBlock: Block = {
    id: 'demo-js-animation',
    type: 'custom-code',
    title: 'JavaScript Animation Example',
    content: {
      html: `
        <div class="animation-container">
          <div id="animated-box" class="box"></div>
          <button id="animate-btn">Start Animation</button>
        </div>
      `,
      css: `
        .animation-container {
          text-align: center;
          padding: 2rem;
        }
        .box {
          width: 80px;
          height: 80px;
          background: #ff6b6b;
          margin: 2rem auto;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        button {
          background: #4ecdc4;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }
      `,
      javascript: `
        let isAnimating = false;
        const box = document.getElementById('animated-box');
        const button = document.getElementById('animate-btn');
        
        button.addEventListener('click', () => {
          if (isAnimating) return;
          
          isAnimating = true;
          button.textContent = 'Animating...';
          
          let rotation = 0;
          let scale = 1;
          const interval = setInterval(() => {
            rotation += 10;
            scale = 1 + Math.sin(rotation * Math.PI / 180) * 0.3;
            box.style.transform = \`rotate(\${rotation}deg) scale(\${scale})\`;
            box.style.background = \`hsl(\${rotation}, 70%, 60%)\`;
            
            if (rotation >= 360) {
              clearInterval(interval);
              box.style.transform = 'rotate(0deg) scale(1)';
              box.style.background = '#ff6b6b';
              button.textContent = 'Start Animation';
              isAnimating = false;
            }
          }, 20);
        });
      `,
      codeType: 'combined',
      showPreview: true,
      autoRun: true,
      enableHtml: true,
      enableCss: true,
      enableJs: true,
      securityWarnings: true,
      sandboxMode: true
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    design: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    }
  };

  // Example 3: Simple Counter
  const counterExampleBlock: Block = {
    id: 'demo-counter',
    type: 'custom-code',
    title: 'Interactive Counter Example',
    content: {
      html: `
        <div class="counter-app">
          <h3>Counter App</h3>
          <div class="counter-display">0</div>
          <div class="button-group">
            <button class="btn-decrease">-</button>
            <button class="btn-reset">Reset</button>
            <button class="btn-increase">+</button>
          </div>
        </div>
      `,
      css: `
        .counter-app {
          background: #f8f9fa;
          border: 2px solid #dee2e6;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          max-width: 300px;
          margin: 0 auto;
        }
        .counter-display {
          font-size: 3rem;
          font-weight: bold;
          color: #495057;
          margin: 1rem 0;
        }
        .button-group {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }
        button {
          background: #007bff;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }
        .btn-decrease { background: #dc3545; }
        .btn-reset { background: #6c757d; }
        .btn-increase { background: #28a745; }
      `,
      javascript: `
        let count = 0;
        const display = document.querySelector('.counter-display');
        const btnDecrease = document.querySelector('.btn-decrease');
        const btnReset = document.querySelector('.btn-reset');
        const btnIncrease = document.querySelector('.btn-increase');
        
        function updateDisplay() {
          display.textContent = count;
          display.style.color = count > 0 ? '#28a745' : count < 0 ? '#dc3545' : '#495057';
        }
        
        btnDecrease.addEventListener('click', () => {
          count--;
          updateDisplay();
        });
        
        btnReset.addEventListener('click', () => {
          count = 0;
          updateDisplay();
        });
        
        btnIncrease.addEventListener('click', () => {
          count++;
          updateDisplay();
        });
        
        updateDisplay();
      `,
      codeType: 'combined',
      showPreview: true,
      autoRun: true,
      enableHtml: true,
      enableCss: true,
      enableJs: true,
      securityWarnings: true,
      sandboxMode: true
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    design: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    }
  };

  const updateBlock = () => {
    console.log('Block updated');
  };

  const deleteBlock = () => {
    console.log('Block deleted');
  };

  return (
    <div className="space-y-8 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Custom Code Block Examples</h1>
        <p className="text-muted-foreground">
          These examples demonstrate the power and flexibility of the Custom Code Block
          with sandboxed execution and security protections.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. HTML + CSS Card</h2>
          <div className="border rounded-lg">
            <CustomCodeBlock
              block={htmlExampleBlock}
              onUpdate={updateBlock}
              onDelete={deleteBlock}
              isEditing={false}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. JavaScript Animation</h2>
          <div className="border rounded-lg">
            <CustomCodeBlock
              block={jsExampleBlock}
              onUpdate={updateBlock}
              onDelete={deleteBlock}
              isEditing={false}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. Interactive Counter</h2>
          <div className="border rounded-lg">
            <CustomCodeBlock
              block={counterExampleBlock}
              onUpdate={updateBlock}
              onDelete={deleteBlock}
              isEditing={false}
            />
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Security Features</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>Sandboxed iframe execution prevents code from accessing parent page</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>XSS protection filters dangerous patterns and script injection</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>JavaScript is disabled by default and must be explicitly enabled</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>Security warnings alert users to potentially dangerous code</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>HTML sanitization removes script tags and inline event handlers</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// Export individual examples as well
export const examples = [
  {
    name: 'HTML & CSS Card',
    code: `<div class="demo-card">
  <h2>Welcome to Custom Code!</h2>
  <p>This is a demonstration of HTML and CSS capabilities.</p>
  <button onclick="alert('Hello!')">Click Me</button>
</div>`,
    css: `.demo-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
}`
  },
  {
    name: 'Animated Box',
    code: `<div class="animation-container">
  <div id="animated-box" class="box"></div>
  <button id="animate-btn">Start Animation</button>
</div>`,
    javascript: `// JavaScript animation code here`
  }
];

export default CustomCodeBlockExamples;
